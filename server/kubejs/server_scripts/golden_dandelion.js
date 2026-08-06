// priority: 0
const GOLDEN_DANDELION = 'golden_dandelion:golden_dandelion';
const FROZEN_TAG = 'golden_dandelion_frozen';

// 兜底全量重建间隔（tick，200 = 10 秒）。仅用于服务器重启后恢复
// persistentData 中遗留的冻结标记，正常运行时不会触发全量扫描。
const REBUILD_INTERVAL = 200;

// 已冻结实体集合。key = "维度:实体id"（实体 id 全局唯一，带维度前缀避免跨维度误查）。
// 集合只包含"被喂食过"的实体，数量极少，因此 LevelEvents.tick 里只遍历这个集合，
// 不再每 tick 全量遍历世界中的所有实体（旧实现是卡顿与内存分配的主因）。
const frozenKeys = {};   // 用普通对象当 Set（key -> true），避免依赖 Java 包对象
let tickCount = 0;

// 在指定维度内全量扫描一次，重建该维度的冻结集合（处理重启后遗留标记/实体换维度）
function rebuildFrozenKeys(level) {
    const dimPrefix = level.dimension.toString() + ':';

    // 先清掉本维度旧的 key
    const oldKeys = Object.keys(frozenKeys);
    for (let i = 0; i < oldKeys.length; i++) {
        if (oldKeys[i].startsWith(dimPrefix)) delete frozenKeys[oldKeys[i]];
    }

    // 再扫描本维度所有实体，仅把仍带标记的加回集合
    const all = level.getEntities();
    for (let i = 0; i < all.size(); i++) {
        const e = all.get(i);
        if (e !== null && e.persistentData.contains(FROZEN_TAG)) {
            frozenKeys[dimPrefix + e.id] = true;
        }
    }
}

// ========== 合成配方 ==========
ServerEvents.recipes(event => {
    event.shaped(GOLDEN_DANDELION, [
        'GGG',
        'GPG',
        'GGG'
    ], {
        G: 'minecraft:gold_nugget',
        P: 'minecraft:dandelion'
    });
});

// ========== 喂食交互 ==========
ItemEvents.entityInteracted(event => {
    const { player, hand, item, target, level } = event;

    if (item.getId() !== GOLDEN_DANDELION) return;

    // 仅服务端执行
    if (level.isClientSide()) return;

    // 目标必须是幼年生物
    if (!target.isBaby()) {
        player.tell(Text.translatable('text.golden_dandelion.not_baby'));
        event.cancel();
        return;
    }

    const pd = target.persistentData;
    const isFrozen = pd.getBoolean(FROZEN_TAG);
    const key = level.dimension.toString() + ':' + target.id;

    if (!isFrozen) {
        // 冻结：标记 + 加入集合 + 播放音效
        pd.putBoolean(FROZEN_TAG, true);
        frozenKeys[key] = true;
        target.playSound('entity.generic.eat', 1.0, 1.0);
        player.tell(Text.translatable('text.golden_dandelion.frozen'));
    } else {
        // 解冻：清除标记 + 移出集合 + 恢复标准幼年初始年龄 (约-24000)
        pd.remove(FROZEN_TAG);
        delete frozenKeys[key];
        target.setAge(-24000);   // 保证后续正常生长
        target.playSound('entity.generic.eat', 1.0, 1.0);
        player.tell(Text.translatable('text.golden_dandelion.unfrozen'));
    }

    // 消耗物品（非创造）
    if (!player.isCreative()) {
        item.count--;
        player.setItemInHand(hand, item.count > 0 ? item : Item.EMPTY);
    }

    event.cancel();  // 避免触发原版喂食行为
});

// ========== 冻结维持：只遍历"冻结集合"（数量极少），不再每 tick 全量扫描 ==========
LevelEvents.tick(event => {
    const level = event.level;
    if (level.isClientSide()) return;

    tickCount++;
    // 每 10 秒兜底重建一次（应对服务器重启后 persistentData 残留标记）
    if (tickCount % REBUILD_INTERVAL === 0) {
        rebuildFrozenKeys(level);
    }

    const dimPrefix = level.dimension.toString() + ':';
    const keys = Object.keys(frozenKeys);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        // 只处理本维度的冻结实体
        if (!key.startsWith(dimPrefix)) continue;
        const entity = level.getEntity(parseInt(key.substring(dimPrefix.length)));
        if (entity === null) { delete frozenKeys[key]; continue; }

        const pd = entity.persistentData;
        if (!pd.getBoolean(FROZEN_TAG)) { delete frozenKeys[key]; continue; }
        if (!entity.isBaby()) {
            // 生物已成年：解除冻结标记
            pd.remove(FROZEN_TAG);
            delete frozenKeys[key];
            continue;
        }
        // 维持幼年：抵消每 tick 的自然成长
        entity.setAge(entity.getAge() - 1);
    }
});
