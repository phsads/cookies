var game
function start() {
    	var gameSave
        gameSave = localStorage.cookie2save
	try {gameSave = atob(gameSave)} catch {}
    	if (gameSave == "undefined"||gameSave==null||gameSave=="[object Object]")
        	gameSave = {}
    	else
			gameSave = JSON.parse(gameSave)
    	game = {
        	cookie:gameSave.cookie||0,
        	cps:gameSave.cps||0,
        	cpc:gameSave.cpc||1,
        	clicks:gameSave.clicks||0,
        	generator:gameSave.generator||0,
        	upgrades:gameSave.upgrades||[false,false,false],
        	upgradesUnlocked:gameSave.upgradesUnlocked||[false,false,false],
        	goals:gameSave.goals||0,
        	money:gameSave.money||0,
        	mpc:gameSave.mpc||1,
        	factory:gameSave.factory||0,
		demolisher:gameSave.demolisher||0,
		metal:gameSave.metal||0,
		generatorReinforcement:gameSave.generatorReinforcement||0,
		factoryReinforcement:gameSave.factoryReinforcement||0,
		demolisherReinforcement:gameSave.demolisherReinforcement||0,
    	}	
    	var a = 0
    	while (a < game.goals) {
        	a++
        	var unlocks = document.getElementsByClassName("goal"+a), b
        	for (b in unlocks) {
            		unlocks[b].hidden = false
        	}
    	}
    	var upLength = game.upgrades.length
    	var unLength = game.upgradesUnlocked.length
    	while (upLength < 6) {
        	game.upgrades.push(false)
        	upLength++
    	} 
    	while (unLength < 6) {
        	game.upgradesUnlocked.push(false)
        	unLength++
    	} /* upgrades length */

	//weolcm the consl
	/*
	console.log("Welcome to the console!")
	console.log("Here you can manually save, export or import the game and more!")
	console.log("	Save the game by typing saveGame() in the console.")
	console.log("	Export the game save by typing exportGame() in the console.")
	console.log("	Import the game save by typing importGame() in the console.")
	console.log("	Hard reset the game save by typing resetGame() in the console.")
	*/
}
function buy(type) {
    	switch (type) {
        	case "cookie":
            		game.clicks++
            		game.cookie += game.cpc
        	break;
        	case "generator":
            		var cost = getCost("generator")
            		if (game.cookie >= cost) {
				game.cookie -= cost
                		game.generator++
            		}
        	break;
        	case "u1":
            		if (game.cookie>=200) {
                		game.upgrades[0] = true
                		game.cookie-=200
            		}
        	break;
		case "u2":
            		if (game.generator>=55) {
                		game.upgrades[1] = true
                		game.generator-=55
			}
        	break;
        	case "u3": 
            		if (game.factory>=3) {
                		game.upgrades[2] = true
                		game.factory -= 3
            		}
        	break;
        	case "u4": 
        	    	if (game.money>=1e7) {
        	        	game.upgrades[3] = true
        	        	game.money -= 1e7
        	    	}
        	break;
		case "u5":
			if (game.generator>=3.45e6) {
				game.upgrades[4] = true
				game.generator -= 3.45e6
			}
		break;
		case "u6":
			if (game.metal >= 2.5e4) {
				game.upgrades[5] = true
				game.metal -= 2.5e4
			}
		break;
        	case "money1":
        	    	game.money += game.cookie*game.mpc*0.01
        	    	game.cookie *= 0.99
        	break;
        	case "money2": 
        	   	game.money += game.cookie*game.mpc 
        	    	game.cookie = 0
        	break;
        	case "factory": 
        	    	var cost = getCost("factory")
        	    	if (game.money >= cost) {
        	        	game.money -= cost
        	        	game.factory++
        	    	}
        	break;
		case "demolisher": 
        	    	var cost = getCost("demolisher")
        	    	if (game.money >= cost) {
        	        	game.money -= cost
        	        	game.demolisher++
        	    	}
        	break;
    }
} //nostalgia when i used to code like this (plus the horrible inefficiency)
function unlockUpgrades() {
    game.upgradesUnlocked[0] = game.goals >= 2
    game.upgradesUnlocked[1] = game.goals >= 3
    game.upgradesUnlocked[2] = game.goals >= 4
    game.upgradesUnlocked[3] = game.goals >= 5
    game.upgradesUnlocked[4] = getReinforcementMult("generator") >= 2
    game.upgradesUnlocked[5] = game.goals >= 6
}
function getUpgradeEffect(x) {
	switch (x) {
		case 0: return game.clicks**0.33;
		case 1:
        	return game.generator <= 150 ? game.generator**2.2/100+1 : 150**2.2/100+1+(game.generator-150)**1.05
		case 2:
			return [
				game.factory <= 200 ? game.factory/20+1 : game.factory**0.2+11,
				game.generator <= 200 ? game.generator/20+1 : game.generator**0.2+11
			]
	}
}
function updateMPC() {
    	game.mpc = Math.max(game.mpc+Math.random()*0.33-0.15,0.1)
}
function update() {
	if (game.upgrades[1]) {game.cpc = 1 + getUpgradeEffect(1)}
    	var upgradeElm = [document.getElementById("upgrade"),document.getElementById("upgradeDescription"),document.getElementById("upgradeCost")]
    	unlockUpgrades()
    	/*upgrade box content*/
	if (JSON.stringify(game.upgradesUnlocked)==JSON.stringify(game.upgrades)) {
        	upgradeElm[0].textContent = "Upgrade"
        	upgradeElm[1].textContent = "There are no upgrades at the moment."
        	upgradeElm[2].hidden = true
    	} else {
		var upgEff = [
			"Clicks boost generators.",
			"Generators boost CPC.",
			"Generators and factories boost each other.",
			"Factories produce generators at a reduced rate.",
			"Increase the reinforcement multiplier to 0.5x",
			"Metal gain is boosted by generator reinforcement multiplier.",
		]
		var upgCost = [
			"200.00 cookies",
			"55 generators",
			"3 factories",
			"1.00e7 money",
			"3.45e6 generators",
			"2.5e4 metal",
		]
		var t = game.upgrades.lastIndexOf(true)
		if (t != game.upgrades.length-1) {
			upgradeElm[0].textContent = "Upgrade " + (t+2)
			upgradeElm[1].textContent = upgEff[t+1]
			upgradeElm[2].hidden = false
			upgradeElm[2].textContent = upgCost[t+1]
			upgradeElm[2].onclick = new Function("buy('u"+(t+2)+"')")
		}
    	}
    	document.getElementById("upgradeEffects").hidden = true
    	document.getElementById("cookies").textContent = fix(game.cookie)
    	document.getElementById("money").textContent = fix(game.money)
    	document.getElementById("mpc").textContent = fix(game.mpc)
    	document.getElementById("generatorAmt").textContent = fix(game.generator)
    	document.getElementById("generatorCost").textContent = fix(getCost("generator"))
	document.getElementById("generatorProd").textContent = fix(getProduction("generator")[0])
    	document.getElementById("factoryAmt").textContent = fix(game.factory)
    	document.getElementById("factoryCost").textContent = fix(getCost("factory"))
	document.getElementById("factoryProd0").textContent = fix(getProduction("factory")[0])
	document.getElementById("factoryProd1").textContent = fix(getProduction("factory")[1])
    	document.getElementById("demolisherAmt").textContent = fix(game.demolisher)
    	document.getElementById("demolisherCost").textContent = fix(getCost("demolisher"))
	document.getElementById("demolisherProd0").textContent = fix(getProduction("demolisher")[0])
	document.getElementById("demolisherProd1").textContent = fix(getProduction("demolisher")[1])
    	document.getElementById("u1").textContent = "u1: Generators generate "+fix(getUpgradeEffect(0))+"x more cookies"
    	document.getElementById("u2").textContent = "u2: +"+fix(getUpgradeEffect(1))+" CPC"
    	document.getElementById("u3").innerHTML = "u3a: Boosts generators by "+fix(getUpgradeEffect(2)[0])+"x <br> u3b: Boosts factories by "+fix(getUpgradeEffect(2)[1])+"x"
	document.getElementById("u6").textContent = "u6: Metal gain is increased by " + fix(getReinforcementMult("generator")) +'x'
	document.getElementById("buyGen").hidden = getCost("generator") == Infinity
	document.getElementById("metal").textContent = fix(game.metal)
	document.getElementById("metalEff").textContent = fix((getProduction("demolisher")[0]/getProduction("demolisher")[1])||1)
	var reinforcementTypes = ["generator","factory","demolisher"]
	for (let b in reinforcementTypes) {
		var t = reinforcementTypes[b]
		document.getElementById(t+"ReinforcementMult").textContent = "(" + fix(getReinforcementMult(t)) + "x -> " + fix(getReinforcementMult(t,1)) + "x)"
		document.getElementById(t+"ReinforcementCost").textContent = fix(getReinforcementCost(t))
	}
	var unlocks = document.getElementsByClassName("goal"+(game.goals*1+1))
	var goalReqs = [
		game.cookie>=10,
		game.generator>=10,
		game.generator>=50,
		game.cookie>=2e4,
		game.money>=1e7,
		game.demolisher>=25,
	]
	var nextGoal = [
		"Goal: Get 10 cookies",
		"Goal: Get 10 generators",
		"Goal: Get 50 generators",
		"Goal: Get 2e4 cookies",
		"Goal: Get 1e7 money",
		"Goal: Get 25 demolishers",
	]
	if (goalReqs[game.goals]) {
		game.goals++
		for (let a in unlocks) unlocks[a].hidden = false
	}
	document.getElementById("goal").textContent = nextGoal[game.goals]||"You've achieved all goals! (as of now)"
    	for (let b in game.upgrades) {
        	if (game.upgrades[b]) {
            		document.getElementById("upgradeEffects").hidden = false
            		document.getElementById("u"+(b*1+1)).hidden = false
        	} else {
            		document.getElementById("u"+(b*1+1)).hidden = true
        	}
   	}
}
function generate() {
        game.generator += getProduction("factory")[1]
	game.generator -= getProduction("demolisher")[1]
	game.metal += getProduction("demolisher")[0]
    	game.cookie += getProduction("generator")[0]+getProduction("factory")[0]
}
function getProduction(type) {
	switch (type) {
		case "generator":
			return [game.generator*(
					getReinforcementMult("generator") *
					(game.upgrades[0] ? getUpgradeEffect(0) : 1) *
					(game.upgrades[2] ? getUpgradeEffect(2)[0] : 1)
				)]
		case "factory":
			var mult = getReinforcementMult("factory") * (game.upgrades[2]? getUpgradeEffect(2)[1] : 1)
			return [game.factory*mult*500,game.factory**0.5*15*mult*game.upgrades[3]]
		case "demolisher":
			var mult = getReinforcementMult("demolisher"), eff = game.upgrades[5] ? getReinforcementMult("generator") : 1
			var genProduction = getProduction("factory")[1]
			var genDestroyed = Math.min(game.demolisher*mult*eff,genProduction/2)
			return [genDestroyed,genDestroyed/eff]
	}
}
function getCost(type) {
	switch (type) {
		case "generator":  return Math.round(10*1.1**game.generator);
		case "factory":    return 1.2**game.factory*4e4;
		case "demolisher": return 1.4**game.demolisher*1e9;
	}
}
function reinforce(type) {
	const cost = getReinforcementCost(type)
	if (game.metal >= cost) {
		game.metal -= cost
		game[type+"Reinforcement"]++
	}
}
function getReinforcementCost(type) {
	const costFactor = {
		"generator":50,
		"factory":500,
		"demolisher":5000,
	}
	return costFactor[type]*1.1**game[type+"Reinforcement"]
}
function getReinforcementMult(type,plusLevel = 0) {
	var RFactor = 0.2 + (game.upgrades[4]*0.3)
	return 1+RFactor*(game[type+"Reinforcement"]+plusLevel)
}
function fix(num,accr=2) {
    if (typeof num !== "number")
        return num
    if (Infinity>num&&num>999) {
        var exp = Math.floor(Math.log10(num))
        var mantissa = Number(num/(10**exp)).toFixed(accr)
        return mantissa+"e"+exp
    }
    return num.toFixed(accr) 
}
function saveGame(manual = true) {
    localStorage.setItem("cookie2save",btoa(JSON.stringify(game)))
	if (manual) {
		alert("Saved your progress!")
		console.log("Game saved!")
	}
}
function exportGame() {
	prompt("Here is your game progress data!",btoa(JSON.stringify(game)))
}
function importGame() {
	var t = prompt("Import your game progress data here!")
	if (t != "" && t != null) {
		try {
			atob(t)
			localStorage.setItem("cookie2save",t)
		} catch {
			localStorage.setItem("cookie2save",btoa(t))
		}
		window.location.reload()
	}
	//{"cookie":6543180446641191,"cps":0,"cpc":3397189032.462114,"clicks":1492,"generator":1194694459.1747198,"upgrades":[true,true,true,true,true,true],"upgradesUnlocked":[true,true,true,true,true,true],"goals":6,"money":60673358320762.55,"mpc":10.71547851398642,"factory":120,"demolisher":25,"metal":34672847.692498714,"generatorReinforcement":84,"factoryReinforcement":58,"demolisherReinforcement":32}
}
function resetGame() {
	var items = ["bananas","troll", "rocks","hammers","cookies","players","tacos","fists","cups","cakes","diamonds","gems","drills","clowns","burger","smile","balls","cows","chickens"]
	var code;
	if (Math.random() > 0.2)
		code = Math.round(Math.random()*999+1) + items[Math.floor(Math.random()*items.length)] + items[Math.floor(Math.random()*items.length)] + items[Math.floor(Math.random()*items.length)]
	else
		code = Array.from({length:50}, (_, __)=>Math.round(Math.random()*999999+1)).join("")
	var confr = prompt('Type "' + code + '" to completely reset the game')
	if (confr === code) {
		localStorage.setItem("cookie2save","undefined")
		window.location.reload()
	}
}
setInterval(()=>{saveGame(false)}, 5000)
setInterval(generate, 1000)
setInterval(update, 10)
setInterval(updateMPC, 60000)
/* ideas
click button to gain 1 cookie
buy generators for automatic cookies (1/s) (10 cookies)
1st upgrade: unlocks at 10 generators: cookies boost generators (c^0.5) (200 cookies)
goal 3: 50 generators: unlocks 2nd upgrade
2nd upgrade: generators boost cpc (g^2/100) (55 generators)
goal 4: 2e4 cookies: unlocks money
sell cookies for money (fluctuating ratio): 1 money / cookie (-0.15 -> +0.15 (random every update (1 minute) ) )
factory: 40k money (500 cookie / sec) (*1.2)
3rd upgrade: factories and generators boost each other (other/20 (below 200 generators), other^0.2+10 (above 200 gen)) (3 factories)
goal 5: 1e7 money: unlocks 4th upgrade
4th upgrade: factories produce generators at a reduced rate (fac^0.5*15)]
goal 6: 300 metal
*/
