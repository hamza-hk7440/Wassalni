import transportService from '../services/transport.service.js';
class TransportController {
    async create(req, res){
        try {
            const transportData = req.body;
            const newTransport = await transportService.createTransport(transportData);
            res.status(201).json(newTransport);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getAll(req, res){
        try {
            const transports = await transportService.getAllTransports();
            res.status(200).json(transports);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getById(req, res){
        try {
            const { id } = req.params;
            const transport = await transportService.getTransportById(id);
            res.status(200).json(transport);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async update(req, res){
        try {
            const { id } = req.params;
            const updateData = req.body;
            const updatedTransport = await transportService.updateTransport(id, updateData);
            res.status(200).json(updatedTransport);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async delete(req, res){
        try {
            const { id } = req.params;
            await transportService.deleteTransport(id);
            res.status(200).json({ message: "Transport deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
export default new TransportController();