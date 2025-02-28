package workerservice;

import jakarta.jws.WebMethod;
import jakarta.jws.WebService;

@WebService
public interface WorkerService {
    @WebMethod
    String hirePerson(String personId, String position, String startDate);

    @WebMethod
    String fireWorker(String id);
}