package workerservice;


import jakarta.jws.WebService;

@WebService(endpointInterface = "workerservice.WorkerService", serviceName = "WorkerService")
public class WorkerServiceImpl implements WorkerService {

    @Override
    public String hirePerson(String personId, String position, String startDate) {
        // Логика обработки найма работника
        return "Hired: " + personId + " as " + position + " starting from " + startDate;
    }

    @Override
    public String fireWorker(String id) {
        // Логика обработки увольнения работника
        System.out.println("Fire worker: " + id);
        return "Fired worker with ID: " + id;
    }
}