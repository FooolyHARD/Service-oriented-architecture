package workerservice;

import jakarta.xml.ws.Endpoint;

public class WorkerServicePublisher {
    public static void main(String[] args) {
        Endpoint.publish("http://dick.elcom.spb.ru:8080/soap", new WorkerServiceImpl());
        System.out.println("WorkerService is published at http://dick.elcom.spb.ru:8080/soap");
    }
}