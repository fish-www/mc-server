// priority: 0
const GOLDEN_DANDELION = 'golden_dandelion:golden_dandelion';
const FROZEN_TAG = 'golden_dandelion_frozen';
const LivingEntity = Java.loadClass('net.minecraft.world.entity.LivingEntity');
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
 
    if (!isFrozen) {
        // 冻结：标记 + 播放音效
        pd.putBoolean(FROZEN_TAG, true);
        target.playSound('entity.generic.eat', 1.0, 1.0);
        player.tell(Text.translatable('text.golden_dandelion.frozen'));
    } else {
        // 解冻：清除标记 + 恢复标准幼年初始年龄 (约-24000)
        pd.remove(FROZEN_TAG);
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
 
// ========== 全局 Tick 处理冻结与成年清理 ==========
LevelEvents.tick(event => {
    const level = event.level;
    if (level.isClientSide()) return;
 
    // 仅获取所有生物实体，减少遍历基数
    level.getEntities().filter(e => e.living).forEach(entity => {
        const pd = entity.persistentData;
        if (!pd.getBoolean(FROZEN_TAG)) return;
 
        if (!entity.isBaby()) {
            pd.remove(FROZEN_TAG);
            return;
        }
 
        entity.setAge(entity.getAge() - 1);
    });
});