const fs = require('fs');

const dailyCsv = fs.readFileSync('/Users/ibo/Desktop/RPG/src/store/복무성장RPG_퀘스트_스탯보상(일일 CSV).csv', 'utf-8');
const weeklyCsv = fs.readFileSync('/Users/ibo/Desktop/RPG/src/store/복무성장RPG_퀘스트_스탯보상(주간 CSV).csv', 'utf-8');

function parseCsv(csvText, type) {
    const lines = csvText.trim().split('\n');
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Handle basic split by comma, assuming no commas inside the cell values for this simple CSV
        const parts = line.split(',');
        
        // No.,퀘스트ID,보직,퀘스트명,설명,난이도,경험치,획득 스탯,스탯 증가량,태그
        const id = parts[1];
        const title = parts[3];
        const description = parts[4];
        const difficulty = parts[5];
        const rewardXP = parseInt(parts[6], 10);
        const targetStat = parts[7];
        const statIncrease = parseInt(parts[8], 10);
        
        data.push({
            id,
            title,
            description,
            difficulty,
            rewardXP,
            isCompleted: false,
            type,
            targetStat,
            statIncrease
        });
    }
    return data;
}

const dailyQuests = parseCsv(dailyCsv, 'daily');
const weeklyQuests = parseCsv(weeklyCsv, 'weekly');
const allQuests = [...dailyQuests, ...weeklyQuests];

const output = `import { QuestType } from "./useStore";

export interface QuestData {
  id: string;
  title: string;
  description: string;
  difficulty: "하" | "중" | "상";
  rewardXP: number;
  isCompleted: boolean;
  type: QuestType;
  targetStat?: string;
  statIncrease?: number;
}

export const ALL_QUESTS: QuestData[] = ${JSON.stringify(allQuests, null, 2)};
`;

fs.writeFileSync('/Users/ibo/Desktop/RPG/src/store/questsData.ts', output);
console.log('Successfully updated questsData.ts with ' + allQuests.length + ' quests.');
