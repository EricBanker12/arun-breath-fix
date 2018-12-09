module.exports = function arunBreathFix(dispatch) {
    const mystic = 7
    const arunBreath = 702012
    const titanicFavor = 5
    const boomerangPulse = 42
    
    let gameId,
        job,
        targets

    //S_LOGIN
    dispatch.hook('S_LOGIN', 10, (event) => {
        gameId = event.gameId
        job = (event.templateId - 10101) % 100
        targets = new Map()
    })

    //S_LOAD_TOPO
    dispatch.hook('S_LOAD_TOPO', 'raw', () => {
        targets = new Map()
    })

    //S_ABNORMALITY_BEGIN
    dispatch.hook('S_ABNORMALITY_BEGIN', 3, addTarget)

    //S_ABNORMALITY_REFRESH
    dispatch.hook('S_ABNORMALITY_REFRESH', 1, addTarget)

    // addTarget
    function addTarget(event) {
        if (job == mystic) {
            if (event.id == arunBreath) {
                if (event.target != gameId) {
                    targets.set(event.target, true)
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
                targets.delete(event.target)
            }
        }
    }

    //S_EACH_SKILL_RESULT
    dispatch.hook('S_EACH_SKILL_RESULT', 12, (event) => {
        if (job == mystic) {
            if (event.source == gameId || event.owner == gameId) {
                let skill = Math.floor(event.skill.id / 10000)
                //console.log('skill', skill)
                if (skill == titanicFavor || skill == boomerangPulse) {
                    if (targets.get(event.target)) {
                        sendHeal(event)
                    }
                }
            }
        }
    })

    function sendHeal(event) {
        event.damage = 15000
        event.crit = false
        dispatch.toClient('S_EACH_SKILL_RESULT', 12, event)
    }
}