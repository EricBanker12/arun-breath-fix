module.exports = function arunBreathFix(dispatch) {
    const mystic = 7
    const arunBreath = 702012
    const titanicFavor = 5
    const boomerangPulse = 42
    
    let gameId,
        job,
        targets = {}

    //S_LOGIN
    dispatch.hook('S_LOGIN', 10, (event) => {
        gameId = event.gameId
        job = (event.templateId - 10101) % 100
        targets = {}
    })

    //S_LOAD_TOPO
    dispatch.hook('S_LOAD_TOPO', 'raw', () => {
        targets = {}
    })

    //S_ABNORMALITY_BEGIN
    dispatch.hook('S_ABNORMALITY_BEGIN', dispatch.base.majorPatchVersion >= 75 ? 3 : 2, addTarget)

    //S_ABNORMALITY_REFRESH
    dispatch.hook('S_ABNORMALITY_REFRESH', 1, addTarget)

    // addTarget
    function addTarget(event) {
        if (job == mystic) {
            if (event.id == arunBreath) {
                let target = event.target
                if (target.sub(gameId) != 0) {
                    if (typeof target == "bigint") {
                        let high = target >> 32,
                            low = target % high << 32
                        target = {high: Number(high), low: Number(low)}
                    }
                    if (!targets[target.high]) targets[target.high] = {}
                    if (!targets[target.high][target.low]) targets[target.high][target.low] = true
                }
            }
        }
    }

    //S_ABNORMALITY_END
    dispatch.hook('S_ABNORMALITY_END', 1, removeTarget)

    // removeTarget
    function removeTarget(event) {
        if (job == mystic) {
            if (event.id == arunBreath) {
                let target = event.target
                if (typeof target == "bigint") {
                    let high = target >> 32,
                        low = target % high << 32
                    target = {high: Number(high), low: Number(low)}
                }
                if (targets[target.high] && targets[target.high][target.low]) {
                    delete targets[target.high][target.low]
                    if (Object.keys(targets[target.high]).length == 0) {
                        delete targets[target.high]
                    }
                }
            }
        }
    }

    //S_EACH_SKILL_RESULT
    dispatch.hook('S_EACH_SKILL_RESULT', 12, (event) => {
        if (job == mystic) {
            if (event.source.sub(gameId) = 0 || event.owner.sub(gameId) == 0) {
                let skill = Math.floor(event.skill.id / 10000)
                //console.log('skill', skill)
                if (skill == titanicFavor || skill == boomerangPulse) {
                    let target = event.target
                    if (typeof target == "bigint") {
                        let high = target >> 32,
                            low = target % high << 32
                        target = {high: Number(high), low: Number(low)}
                    }
                    if (targets[target.high] && targets[target.high][target.low]) {
                        sendHeal(event)
                    }
                }
            }
        }
    })

    function sendHeal(event) {
        event.damage = 15000
        event.crit = 0
        dispatch.toClient('S_EACH_SKILL_RESULT', 12, event)
    }
}