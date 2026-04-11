import stationService from "../services/station.service.js";

class StationController {
  async getAllStations(req, res) {
    try {
      const stations = await stationService.getAllStations();
      res.status(200).json(stations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async getStationById(req, res) {
    try {
      const { id } = req.params;
      const station = await stationService.getStationById(id);
      res.status(200).json(station);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async createStation(req, res) {
    try {
      const station = req.body;
      const newStation = await stationService.createStation(station);
      res.status(201).json(newStation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async updateStation(req, res) {
    try {
      const { id } = req.params;
      const station = req.body;
      const updatedStation = await stationService.updateStation(id, station);
      res.status(200).json(updatedStation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async deleteStation(req, res) {
    try {
      const { id } = req.params;
      const deletedStation = await stationService.deleteStation(id);
      res.status(200).json(deletedStation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new StationController();
