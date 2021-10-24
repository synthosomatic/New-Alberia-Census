// Your code here!
document.addEventListener("DOMContentLoaded", function (event) {
// initial
var db, x, i
var lang = document.documentElement.lang

// content elements
var logInOutMessage = document.createElement("h4")
logInOutMessage.setAttribute("id", "logInOutMessage")

var logInOutButton = document.createElement("button")
logInOutButton.setAttribute("value", "userAuthStateChange")
logInOutButton.textContent = "Logout"
logInOutButton.addEventListener("click", function() {
	firebase
		.auth()
		.signOut()
		.then(function() {
			// Sign-out successful, redirect home
			location.href = "/"
		})
		.catch(function(error) {
			// An error happened.
		})
})

var header = document.getElementsByTagName("header")[0]
var headerNav = document.createElement("span")
headerNav.setAttribute("id", "headerNav")
header.appendChild(headerNav)

var navContent = [
	{ value: "home", text: "Home" },
	{ value: "adventurers", text: "Adventurers" },
	{ value: "weapons", text: "Weapons" },
	{ value: "wyrmprints", text: "Wyrmprints" },
	{ value: "dragons", text: "Dragons" },
	{ value: "halidom", text: "Halidom" },
	{ value: "shopping", text: "Shopping List" },
	{ value: "teams", text: "Team Builder" }
]
for (i = 0; i < navContent.length; i++) {
	var navButton = document.createElement("button")
	navButton.setAttribute("class", "nav")
	navButton.setAttribute("value", navContent[i]["value"])
	navButton.textContent = navContent[i]["text"]
	headerNav.appendChild(navButton)
}

var nav = document.getElementsByClassName("nav")
header.appendChild(logInOutMessage)

var main = document.getElementsByTagName("main")[0]
var content = document.getElementsByTagName("content")[0]
var subcontent = document.getElementsByTagName("subcontent")[0]

var firebaseuiAuthContainer = document.createElement("div")
firebaseuiAuthContainer.setAttribute("id", "firebaseui-auth-container")
var loader = document.createElement("div")
loader.setAttribute("id", "loader")

subcontent.appendChild(firebaseuiAuthContainer)
subcontent.appendChild(loader)

//initialize the database
db = firebase.firestore()

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth())

//instantiate user data
var user = firebase.auth().currentUser

// determine user login state
firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		// generate user greeting and login/out button
		subcontent.removeChild(firebaseuiAuthContainer)
		subcontent.removeChild(loader)
		logInOutMessage.textContent = "Welcome, " + user.displayName + "!"
		logInOutMessage.appendChild(logInOutButton)
		for (i = 0; i < nav.length; i++) {
			nav[i].removeAttribute("disabled")
		}
	} else {
		// generate user greeting
		for (i = 0; i < nav.length; i++) {
			nav[i].setAttribute("disabled", "disabled")
		}
		logInOutMessage.textContent = "You are not signed in."
	}
})

ui.start("#firebaseui-auth-container", {
	callbacks: {
		signInSuccessWithAuthResult: function(authResult, redirectUrl) {
			// User successfully signed in.
			// Return type determines whether we continue the redirect automatically
			// or whether we leave that to developer to handle.
			return true
		},
		uiShown: function() {
			// The widget is rendered.
			// Hide the loader.
			document.getElementById("loader").style.display = "none"
		}
	},
	// Will use popup for IDP Providers sign-in flow instead of the default, redirect.
	signInFlow: "popup",
	signInSuccessUrl: "/",
	signInOptions: [
		firebase.auth.GoogleAuthProvider.PROVIDER_ID,
		{
			provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
			requireDisplayName: true
		}
	],
	credentialHelper: firebaseui.auth.CredentialHelper.NONE,
	// Terms of service url.
	tosUrl: "<your-tos-url>",
	// Privacy policy url.
	privacyPolicyUrl: "<your-privacy-policy-url>"
	// Other config options...
})

// header navigation buttons
for (i = 0; i < nav.length; i++) {
	nav[i].addEventListener("click", function() {
		var lookup
		if (user.isAnonymous) {
			lookup = "home"
		} else {
			lookup = this.value
		}
		switch (lookup) {
			case "adventurers":
				content.innerHTML = ""
				subcontent.innerHTML = ""
				fetchAdventurers()
				break
			case "weapons":
				content.innerHTML = ""
				subcontent.innerHTML = "weapons"
				break
			case "wyrmprints":
				content.innerHTML = ""
				subcontent.innerHTML = "wyrmprints"
				break
			case "dragons":
				content.innerHTML = ""
				subcontent.innerHTML = "dragons"
				break
			case "halidom":
				content.innerHTML = ""
				subcontent.innerHTML = "halidom"
				break
			case "shopping":
				content.innerHTML = ""
				subcontent.innerHTML = "shopping"
				break
			case "teams":
				content.innerHTML = ""
				subcontent.innerHTML = ""
				fetchTeams()
				break
			case "home":
				content.innerHTML = ""
				subcontent.innerHTML = ""
				break
			default:
				content.innerHTML = ""
				subcontent.innerHTML = "No data."
		}
	})
}

var name, element, elementID, rarity, adventurer

fetchTeams()

function fetchTeams() {
	// var team = [110012, 110349, 110303, 110257]
	var team = [110291,110291,110291,110291]

	// stage drilldowns
	var questsButton = document.createElement("button")
	questsButton.textContent = "Quests"
	var eventsButton = document.createElement("button")
	eventsButton.textContent = "Events"
	content.appendChild(questsButton)
	content.appendChild(eventsButton)

	fetchTeamBuilder(team)
}

function fetchTeamBuilder() {
	var teamBuilderFrame = document.createElement("teamBuilderFrame")

	var teamBuilderHeader = document.createElement("teamBuilderHeader")

	var stageInfo = document.createElement("stageInfo")
	
	var stageElement = document.createElement("stageElement")
	
	var stageName = document.createElement("stageName")
	stageName.textContent = "No Stage Selected"

	var stageMight = document.createElement("stageMight")
	stageMight.textContent = "99999"

	stageInfo.appendChild(stageElement)
	stageInfo.appendChild(stageName)
	stageInfo.appendChild(stageMight)

	teamBuilderHeader.appendChild(stageInfo)

	var teamBuilderBody = document.createElement("teamBuilderBody")
	var teamBuilderFooter = document.createElement("teamBuilderFooter")

	teamBuilderFrame.appendChild(teamBuilderHeader)
	teamBuilderFrame.appendChild(teamBuilderBody)
	teamBuilderFrame.appendChild(teamBuilderFooter)

	main.appendChild(teamBuilderFrame)
}

function fetchChecklist() {}

function fetchAdventurers() {
	db.collection("Adventurers")
		.get()
		.then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
				var adventurerName = document.createElement("button")
				var name = doc.data().FullName[lang]
				// collected = adventurers.find(findID, id, variation)
				adventurerName.classList.add("adventurer")
				adventurerName.setAttribute("elementID", doc.data().ElementID)
				adventurerName.setAttribute("rarity", doc.data().Rarity)
				adventurerName.setAttribute("collected", "1")
				adventurerName.id = doc.data().ID
				adventurerName.setAttribute("variant", doc.data().Variant)
				adventurerName.innerHTML += name
				adventurerName.addEventListener("click", function() {
					fetchAdventurer(doc.data().FullName[lang])
				})
				content.innerHTML = "<h4>Adventurers</h4>"
				content.appendChild(adventurerName)
			})
		})
}

function fetchAdventurer(name) {
	db.collection("Adventurers")
		.doc(name)
		.get()
		.then(function(doc) {
			var circleTables = document.createElement("div")
			circleTables.setAttribute("id", "circleTables")

			subcontent.appendChild(circleTables)

			var adventurerTitle = document.createElement("h2")
			adventurerTitle.innerHTML = doc.data().Title[lang]
			var adventurerName = document.createElement("h1")
			adventurerName.innerHTML = name
			circleTables.appendChild(adventurerTitle)
			circleTables.appendChild(adventurerName)

			manaCircles(doc.data())
		})
		.catch(function(error) {
			console.log("Error getting Adventurer data: ", error)
		})
}

// calcStats([circle number, node number, stat keyname, stat type (hp, str, etc.)])
function calcStats(circle, node, stat, type) {
	switch (circle) {
		case 0:
			if (type === "HP") {
				var mod = 4
				var div = 4
				var plus = 1
			} else if (type === "Strength") {
				var mod = 3
				var div = 3
				var plus = 1
			}
			break
		case 1:
			if (type === "HP") {
				var mod = 4
				var div = 4
				var plus = 1
			} else if (type === "Strength") {
				var mod = 5
				var div = 5
				var plus = 1
			}
			break
		case 2:
			if (type === "HP") {
				var mod = 4
				var div = 4
				var plus = 1
			} else if (type === "Strength") {
				var mod = 3
				var div = 3
				var plus = 1
			}
			break
		case 3:
			if (type === "HP") {
				var mod = 3
				var div = 3
				var plus = 1
			} else if (type === "Strength") {
				var mod = 4
				var div = 4
				var plus = 1
			}
			break
		case 4:
			if (type === "HP") {
				var mod = 2
				var div = 2
				var plus = 1
			} else if (type === "Strength") {
				var mod = 1
				var div = 1
				var plus = 1
			}
			break
		default:
			return "Unknown circle number."
	}
	if (node <= stat % mod) {
		return parseInt(stat / div + plus)
	} else {
		return parseInt(stat / div)
	}
}

function manaCircles(adventurer) {
	var hp01 = calcStats(0, 1, adventurer.PlusHp0, "HP")
	var hp02 = calcStats(0, 2, adventurer.PlusHp0, "HP")
	var hp03 = calcStats(0, 3, adventurer.PlusHp0, "HP")
	var hp04 = calcStats(0, 4, adventurer.PlusHp0, "HP")
	var hp11 = calcStats(1, 1, adventurer.PlusHp1, "HP")
	var hp12 = calcStats(1, 2, adventurer.PlusHp1, "HP")
	var hp13 = calcStats(1, 3, adventurer.PlusHp1, "HP")
	var hp14 = calcStats(1, 4, adventurer.PlusHp1, "HP")
	var hp21 = calcStats(2, 1, adventurer.PlusHp2, "HP")
	var hp22 = calcStats(2, 2, adventurer.PlusHp2, "HP")
	var hp23 = calcStats(2, 3, adventurer.PlusHp2, "HP")
	var hp24 = calcStats(2, 4, adventurer.PlusHp2, "HP")
	var hp31 = calcStats(3, 1, adventurer.PlusHp3, "HP")
	var hp32 = calcStats(3, 2, adventurer.PlusHp3, "HP")
	var hp33 = calcStats(3, 3, adventurer.PlusHp3, "HP")
	var hp41 = calcStats(4, 1, adventurer.PlusHp4, "HP")
	var hp42 = calcStats(4, 2, adventurer.PlusHp4, "HP")
	var str01 = calcStats(0, 1, adventurer.PlusAtk0, "Strength")
	var str02 = calcStats(0, 2, adventurer.PlusAtk0, "Strength")
	var str03 = calcStats(0, 3, adventurer.PlusAtk0, "Strength")
	var str11 = calcStats(1, 1, adventurer.PlusAtk1, "Strength")
	var str12 = calcStats(1, 2, adventurer.PlusAtk1, "Strength")
	var str13 = calcStats(1, 3, adventurer.PlusAtk1, "Strength")
	var str14 = calcStats(1, 4, adventurer.PlusAtk1, "Strength")
	var str15 = calcStats(1, 5, adventurer.PlusAtk1, "Strength")
	var str21 = calcStats(2, 1, adventurer.PlusAtk2, "Strength")
	var str22 = calcStats(2, 2, adventurer.PlusAtk2, "Strength")
	var str23 = calcStats(2, 3, adventurer.PlusAtk2, "Strength")
	var str31 = calcStats(3, 1, adventurer.PlusAtk3, "Strength")
	var str32 = calcStats(3, 2, adventurer.PlusAtk3, "Strength")
	var str33 = calcStats(3, 3, adventurer.PlusAtk3, "Strength")
	var str34 = calcStats(3, 4, adventurer.PlusAtk3, "Strength")
	var str41 = calcStats(4, 1, adventurer.PlusAtk4, "Strength")
	var skill1 = adventurer.Skill1.FullName[lang]
	var skill2 = adventurer.Skill2.FullName[lang]
	var ability11 = adventurer.Abilities11.FullName[lang]
	var ability12 = adventurer.Abilities12.FullName[lang]
	var ability21 = adventurer.Abilities21.FullName[lang]
	var ability22 = adventurer.Abilities22.FullName[lang]
	var ability31 = adventurer.Abilities31.FullName[lang]
	var ability32 = adventurer.Abilities32.FullName[lang]
	var coability1 = adventurer.ExAbilityData1.FullName[lang]
	var coability2 = adventurer.ExAbilityData2.FullName[lang]
	var coability3 = adventurer.ExAbilityData3.FullName[lang]
	var coability4 = adventurer.ExAbilityData4.FullName[lang]
	var coability5 = adventurer.ExAbilityData5.FullName[lang]

	if (adventurer.NodeMap === "0501") {
		var nodes = [
			["Unbind", "Unbind", "Unbind", "Unbind", "Unbind"],
			[
				"HP +" + hp04,
				"New Skill " + skill2 + " Lv. 1",
				"HP +" + hp24,
				"Strength +" + str34,
				"Upgrade Ability " + ability32
			],
			[
				"Strength +" + str03,
				"Strength +" + str15,
				"New Ability " + ability31,
				"HP +" + hp33,
				"HP +" + hp42
			],
			[
				"New Ability " + ability11,
				"HP +" + hp13,
				"Strength +" + str22,
				"Upgrade Force Strike",
				"Damascus Crystal"
			],
			[
				"HP +" + hp03,
				"Strength +" + str14,
				"HP +" + hp23,
				"Strength +" + str33,
				"Strength +" + str41
			],
			[
				"New Adventurer Story",
				"New Adventurer Story",
				"New Adventurer Story",
				"HP +" + hp32,
				"Upgrade Co-ability " + coability2
			],
			[
				"HP +" + hp02,
				"Strength +" + str13,
				"HP +" + hp22,
				"Strength +" + str32,
				"Upgrade Co-ability " + coability3
			],
			[
				"Force Strike",
				"HP +" + hp12,
				"Upgrade Ability " + ability12,
				"Upgrade Ability " + ability22,
				"Upgrade Skill " + skill1 + " Lv. 3"
			],
			[
				"Strength +" + str01,
				"Strength +" + str12,
				"Strength +" + str21,
				"HP +" + hp31,
				"Upgrade Co-ability " + coability4
			],
			[
				"HP +" + hp01,
				"New Adventurer Story",
				"HP +" + hp21,
				"Strength +" + str31,
				"Upgrade Co-ability " + coability5
			],
			[
				"New Ability " + ability21,
				"Strength +" + str11,
				"Upgrade Skill " + skill1 + " Lv. 2",
				"Upgrade Skill " + skill2 + " Lv. 2",
				"HP +" + hp41
			]
		]
	}

	// add circle filters
	var circleList = document.createElement("p")
	var circlenum = 1

	for (i = 1; i <= 5; i++) {
		var circleListing = document.createElement("button")
		circleListing.classList.add("circle", adventurer.ElementID)
		circleListing.innerHTML = "Circle " + i
		circleListing.value = i
		circleList.appendChild(circleListing)
		circleListing.addEventListener("click", function() {
			var circle = this.value
			var nodeTables = document.getElementsByTagName("table")
			for (i = 0; i < nodeTables.length; i++) {
				if (nodeTables[i].getAttribute("circle") === circle) {
					nodeTables[i].style.display = "table"
				} else if (nodeTables[i].getAttribute("circle") !== circle) {
					nodeTables[i].style.display = "none"
				}
			}
		})
	}

	var circleTables = document.getElementById("circleTables")
	circleTables.appendChild(circleList)

	while (circlenum <= 5) {
		// add node tables
		for (i = 1; i <= 10; i++) {
			// generate node table skeletons
			var nodeTable = document.createElement("table")
			nodeTable.setAttribute("circle", circlenum)
			nodeTable.setAttribute("node", i)
			if (circlenum !== 1) {
				nodeTable.style.display = "none"
			}
			var nodeTHead = document.createElement("thead")
			nodeTable.appendChild(nodeTHead)
			var nodeHeaderRow = nodeTHead.insertRow(0)
			nodeTHead.setAttribute("elementID", adventurer.ElementID)
			nodeHeaderRow.setAttribute("id", "nodeHeaderRow")
			var nodeHeader = document.createElement("th")
			nodeHeader.setAttribute("id", "nodeHeader")
			var nodeHeading = document.createElement("span")
			nodeHeading.setAttribute("id", "nodeHeading")
			var rewardHeading = document.createElement("span")
			rewardHeading.setAttribute("id", "rewardHeading")
			nodeHeading.innerHTML = i
			rewardHeading.innerHTML = nodes[i][circlenum - 1]
			nodeHeaderRow.appendChild(nodeHeader)
			nodeHeader.appendChild(nodeHeading)
			nodeHeader.appendChild(rewardHeading)

			var nodeTBody = document.createElement("tbody")

			nodeTable.appendChild(nodeTBody)

			circleTables.appendChild(nodeTable)
		}
		circlenum++
	}

	fetchMaterials(adventurer)
}

function fetchMaterials(adventurer) {
	var eleOrb1 = [
		"Flame Orb",
		"Water Orb",
		"Wind Orb",
		"Light Orb",
		"Shadow Orb"
	]
	eleOrb2 = [
		"Blaze Orb",
		"Stream Orb",
		"Storm Orb",
		"Radiance Orb",
		"Nightfall Orb"
	]
	var eleOrb3 = [
		"Inferno Orb",
		"Deluge Orb",
		"Maelstrom Orb",
		"Refulgence Orb",
		"Nether Orb"
	]
	var eleOrb4 = [
		"Rainbow Orb",
		"Rainbow Orb",
		"Rainbow Orb",
		"Rainbow Orb",
		"Rainbow Orb"
	]
	var dragonScale1 = [
		"Flamewyrm's Scale",
		"Waterwyrm's Scale",
		"Windwyrm's Scale",
		"Lightwyrm's Scale",
		"Shadowwyrm's Scale"
	]
	var dragonScale2 = [
		"Flamewyrm's Scaldscale",
		"Waterwyrm's Glistscale",
		"Windwyrm's Squallscale",
		"Lightwyrm's Glowscale",
		"Shadowwyrm's Darkscale"
	]

	if (adventurer.NodeMap === "0501") {
		var nodes = [
			["Unbind", "Unbind", "Unbind", "Unbind", "Unbind"],
			[
				"HP +" + hp04,
				"New Skill " + skill2 + " Lv. 1",
				"HP +" + hp24,
				"Strength +" + str34,
				"Upgrade Ability " + ability32
			],
			[
				"Strength +" + str03,
				"Strength +" + str15,
				"New Ability " + ability31,
				"HP +" + hp33,
				"HP +" + hp42
			],
			[
				"New Ability " + ability11,
				"HP +" + hp13,
				"Strength +" + str22,
				"Upgrade Force Strike",
				"Damascus Crystal"
			],
			[
				"HP +" + hp03,
				"Strength +" + str14,
				"HP +" + hp23,
				"Strength +" + str33,
				"Strength +" + str41
			],
			[
				"New Adventurer Story",
				"New Adventurer Story",
				"New Adventurer Story",
				"HP +" + hp32,
				"Upgrade Co-ability " + coability2
			],
			[
				"HP +" + hp02,
				"Strength +" + str13,
				"HP +" + hp22,
				"Strength +" + str32,
				"Upgrade Co-ability " + coability3
			],
			[
				"Force Strike",
				"HP +" + hp12,
				"Upgrade Ability " + ability12,
				"Upgrade Ability " + ability22,
				"Upgrade Skill " + skill1 + " Lv. 3"
			],
			[
				"Strength +" + str01,
				"Strength +" + str12,
				"Strength +" + str21,
				"HP +" + hp31,
				"Upgrade Co-ability " + coability4
			],
			[
				"HP +" + hp01,
				"New Adventurer Story",
				"HP +" + hp21,
				"Strength +" + str31,
				"Upgrade Co-ability " + coability5
			],
			[
				"New Ability " + ability21,
				"Strength +" + str11,
				"Upgrade Skill " + skill1 + " Lv. 2",
				"Upgrade Skill " + skill2 + " Lv. 2",
				"HP +" + hp41
			]
		]
	}
}

})