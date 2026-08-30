ServerEvents.recipes(event => {
    // 盲道，切石机切圆石产出
    event.stonecutting('yuushya:tactile_paving', 'minecraft:cobblestone')

    // 点状盲道，切石机切圆石产出
    event.stonecutting('yuushya:tactile_paving_spot', 'minecraft:cobblestone')
});
