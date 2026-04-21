import routeService from "../services/route.service.js";

function validateRoutePayload(routeData, stationSequence) {
  if (!routeData || !stationSequence) {
    return "routeData and stationSequence are required";
  }

  if (!Array.isArray(stationSequence) || stationSequence.length < 2) {
    return "stationSequence must be an array with at least 2 stops";
  }

  const name = String(routeData.name || "").trim();
  if (!name) {
    return "routeData.name is required";
  }

  if (!routeData.start_station_id || !routeData.end_station_id) {
    return "routeData.start_station_id and routeData.end_station_id are required";
  }

  if (
    String(routeData.start_station_id) === String(routeData.end_station_id)
  ) {
    return "Start and end stations must be different";
  }

  for (const stop of stationSequence) {
    if (!stop?.station_id || stop?.sequence_order == null) {
      return "Each stationSequence item must include station_id and sequence_order";
    }
  }

  return null;
}

class RouteController {
  async create(req, res) {
    try {
      const { routeData, stationSequence } = req.body;

      const validationError = validateRoutePayload(routeData, stationSequence);
      if (validationError) {
        return res.status(400).json({
          success: false,
          error: validationError,
        });
      }

      const newRoute = await routeService.createFullRoute(
        routeData,
        stationSequence,
      );
      res.status(201).json({ success: true, route: newRoute });
    } catch (error) {
      const message = String(error?.message || "Internal Server Error");
      const isKnownDataError =
        /duplicate key|violates|foreign key|invalid input syntax|not-null/i.test(
          message,
        );
      const isPermissionError =
        /permission denied|row-level security|rls|not authorized|unauthorized/i.test(
          message,
        );

      if (isKnownDataError) {
        return res.status(400).json({ success: false, error: message });
      }

      if (isPermissionError) {
        return res.status(403).json({ success: false, error: message });
      }

      res.status(500).json({ success: false, error: message });
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

      const validationError = validateRoutePayload(routeData, stationSequence);
      if (validationError) {
        return res.status(400).json({
          success: false,
          error: validationError,
        });
      }

      const updatedRoute = await routeService.updateFullRoute(
        id,
        routeData,
        stationSequence,
      );
      res.status(200).json({ success: true, route: updatedRoute });
    } catch (error) {
      const message = String(error?.message || "Internal Server Error");
      const isKnownDataError =
        /duplicate key|violates|foreign key|invalid input syntax|not-null/i.test(
          message,
        );
      const isPermissionError =
        /permission denied|row-level security|rls|not authorized|unauthorized/i.test(
          message,
        );

      if (isKnownDataError) {
        return res.status(400).json({ success: false, error: message });
      }

      if (isPermissionError) {
        return res.status(403).json({ success: false, error: message });
      }

      res.status(500).json({ success: false, error: message });
    }
  }
}
export default new RouteController();
