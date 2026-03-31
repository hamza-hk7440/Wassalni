import * as scheduleService from "../services/schedule.service.js";
class ScheduleController {
  async create(req, res) {
    try {
      const newSchedule = await scheduleService.createSchedule(req.body);
      res.status(201).json({ success: true, data: newSchedule });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
  async getAll(req, res) {
    try {
      const schedules = await scheduleService.getAllSchedules();
      res.status(200).json({ success: true, data: schedules });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await scheduleService.deleteSchedule(id);
      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
export default new ScheduleController();
