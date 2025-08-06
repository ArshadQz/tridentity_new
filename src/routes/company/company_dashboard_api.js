import express from "express";
import { BKTeam } from "../../entityManagers/backOffice/bkTeam.js";
import { ApiError } from "../helper/ApiError.js";
import { ApiResponse } from "../helper/ApiResponse.js";
import { CMMatch } from "../../entityManagers/company/cmMatch.js";
import { CMVoting } from "../../entityManagers/company/cmVoting.js";
export const company_dashboard_api = express.Router();

const ns = `/company/dashboard`;
company_dashboard_api.get(`${ns}/test`, async function (req, res) {
    const resp = await CMVoting.getVotedPlayer(1, 52);
    // CMVoting.getVotedPlayer(customerId, matchId)
  res.send(`${resp} OK`);
});
company_dashboard_api.post(`${ns}/getManOfTheMatch`, async (req, res) => {
    try {
        const { matchId } = req.body.data;

        if (!matchId) {
            return res.send(new ApiResponse(400, "", "matchId  Missing"));
        }
        const response = await BKTeam.getManOfTheMatch(matchId);

        return res.json(new ApiResponse(200, response, "Player Fetched Successfully"));
    } catch (e) {
        return res.json(new ApiError(500, "Error fetching Player", e.message));
    }
});