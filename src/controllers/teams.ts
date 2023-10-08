import {Request,Response} from 'express'
import { Team } from './../Schema/Team';


export const createTeam = async (req:Request, res:Response) => {
    try {
      const form = new Team(req.body);
      await form.save();
      return res
        .status(200)
        .json({ ok: true, message: "Team Created Successfully." });
    } catch (err) {
      console.log(err);
      return res.status(400).send("Failed to create team.");
    }
  }

export const getTeamsById = async (req:Request, res:Response) => {
    try {
      const teams = await Team.find({ id: req.params.id });
      res.send(teams);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error retrieving form data");
    }
  }

export const updateTeam = async (req:Request, res:Response) => {
    try {
      const form = await Team.updateOne(
        { _id: req.params.id },
        {
          $set: {
            status: req.body.status,
          },
        }
      );
      if (form.modifiedCount > 0) {
        return res
          .status(200)
          .send(
            `Team ${req.body.status ? "Un-archive" : "Archive"} successfully.`
          );
      } else {
        return res.status(404).send("Team not found.");
      }
    } catch (err) {
      return res.status(400).send(`Failed to ${req.body.status ? "Un-archive" : "Archive"} team.`);
    }
  }

