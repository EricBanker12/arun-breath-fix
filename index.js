module.exports = function arunBreathFix(dispatch) {
    const mystic = 7
    const arunBreath = 702012
    const titanicFavor = 5
    const boomerangPulse = 42
    
    let gameId,
        job,
        targets = []

    //S_LOGIN
    dispatch.hook('S_LOGIN', 10, (event) => {
        gameId = event.gameId
        job = (event.templateId - 10101) % 100
        targets = []
    })

    //S_LOAD_TOPO
    dispatch.hook('S_LOAD_TOPO', 'raw', () => {
        targets = []
    })

    //S_ABNORMALITY_BEGIN
    dispatch.hook('S_ABNORMALITY_BEGIN', 2, addTarget)

    //S_ABNORMALITY_REFRESH
    dispatch.hook('S_ABNORMALITY_REFRESH', 1, addTarget)

    // addTarget
    function addTarget(event) {
        if (job == mystic) {
            if (event.id == arunBreath) {
                if (!event.target.equals(gameId)) {
                    let targetString = JSON.stringify(event.target)
                    if (!targets.includes(targetString)) {
                        targets.push(targetString)
                        //console.log(targetString, 'added')
                    }
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
                let targetString = JSON.stringify(event.target)
                if (targets.includes(targetString)) {
                    targets.splice(targets.indexOf(targetString), 1)
                    //console.log(targetString, 'removed')
                }
            }
        }
    }

    //S_EACH_SKILL_RESULT
    dispatch.hook('S_EACH_SKILL_RESULT', 6, (event) => {
        if (job == mystic) {
            if (event.source.equals(gameId) || event.owner.equals(gameId)) {
                let skill = Math.floor((event.skill - 0x4000000) / 10000)
                //console.log('skill', skill)
                if (skill == titanicFavor || skill == boomerangPulse) {
                    //console.log(targets)
                    let targetString = JSON.stringify(event.target)
                    if (targets.includes(targetString)) {
                        setTimeout(sendHeal, 1, event)
                    }
                }
            }
        }
    })

    function sendHeal(event) {
        event.damage = 15000
        event.crit = 0
        dispatch.toClient('S_EACH_SKILL_RESULT', 6, event)
    }
}