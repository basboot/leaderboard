import './App.css'
import {useEffect, useState} from "react";

function App() {
    const loadLeaderbord = async () => {
        const response = await fetch("https://docent.cmi.hro.nl/bootb/aoc/leaderboard.php");
        console.log(response);
        const leaderbord = await response.json();
        console.log(leaderbord);
        setMembers(leaderbord.members)
    }

    useEffect(() => {
        console.log("useEffect");
        loadLeaderbord();
    }, []);

    const [members, setMembers] = useState({})

    let memberList = []
    for (let key of Object.keys(members)) {
        let member = members[key];
        if (!members[key].name) {
            member.name = `Anonymous (${key})`
        }
        memberList.push(member);
    }

    memberList.sort((a, b) => {
        if (a.stars === b.stars) {
            return Math.random() > 0.5 ? 1 : -1 // random order for equal
        } else {
            return (a.stars > b.stars) ? 1 : -1
        }
    }).reverse();

    // add rankings
    let rank = 0;
    let lastScore = 30;
    let staleRank = 0
    for (let member of memberList) {
        rank++;
        if (member.stars < lastScore) {
            lastScore = member.stars;
            staleRank = rank
        }
        member.rank = staleRank;
    }

    const showMembers = memberList.map((member, key) => <li key={key}>{member.rank} - {member.name} ({member.stars} stars)</li>)
    return (
        <div>
        <h1>
            CMGT Leaderboard (stars only)
        </h1>
        <ul>
            {showMembers}
        </ul>
        </div>
    )
}

export default App
