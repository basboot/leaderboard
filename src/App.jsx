import './App.css'
import {useEffect, useState} from "react";

function App() {
    const loadLeaderbord = async () => {
        const response = await fetch("https://docent.cmi.hro.nl/bootb/aoc/leaderboard.php");
        // console.log(response);
        const leaderbord = await response.json();
        // console.log(leaderbord);
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

    function calculatePoints(completionDayLevel) {
        let points = 0;
        const lastDateToScorePoints = new Date('January 8, 2024 00:00:00'); // day after at 00

        const lastDateToScorePointsTS = lastDateToScorePoints.getTime() / 1000;

        for (const [day, stars] of Object.entries(completionDayLevel)) {
            for (const [star, value] of Object.entries(stars)) {
                const tsStar = value.get_star_ts;

                if (tsStar < lastDateToScorePointsTS) {
                    points += 2;
                }
            }
        }

        console.log(completionDayLevel);
        return points;
    }

    const showMembers = memberList.map((member, key) => <li key={key}>{member.rank} [{calculatePoints(member.completion_day_level)}]- {member.name} ({member.stars} stars)</li>)
    return (
        <div>
        <h1 className="title-global">
            <a href="https://cmgt.hr.nl" target="_blank">CMGT Leaderboard (stars only)</a>
        </h1>
            <div>
                Until January the 7th 2024 every star is worth 2 points.
            </div>
        <ul>
            {showMembers}
        </ul>
        </div>
    )
}

export default App
