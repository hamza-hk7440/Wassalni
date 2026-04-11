import routeService from "../services/route.service.js";
class RouteController {
  async create(req, res) {
    try {
      const { routeData, stationSequence } = req.body;

      if (!routeData || !stationSequence) {
        return res.status(400).json({
          success: false,
          error: "routeData and stationSequence are required",
        });
      }
      const newRoute = await routeService.createFullRoute(
        routeData,
        stationSequence,
      );
      res.status(201).json({ success: true, route: newRoute });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
  async getAll(req, res) {
    try {
      const routes = await routeService.getAllRoutes();
      res.status(200).json({ success: true, routes });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
  async getById(req, res) {
    try {
      const { id } = req.params;
      const route = await routeService.getRouteDetails(id);
      res.status(200).json({ success: true, route });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
  async delete(req, res) {
    try {
      const { id } = req.params;
      await routeService.deleteRoute(id);
      res
        .status(200)
        .json({ success: true, message: "Route deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { routeData, stationSequence } = req.body;
      if (!routeData || !stationSequence) {
        return res.status(400).json({
          success: false,
          error: "routeData and stationSequence are required",
        });
      }
      const updatedRoute = await routeService.updateFullRoute(
        id,
        routeData,
        stationSequence,
      );
      res.status(200).json({ success: true, route: updatedRoute });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
export default new RouteController();
