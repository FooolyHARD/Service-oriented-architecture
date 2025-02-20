package org.soa.workerwebebedded.controllers;

import com.soa.ejb.MyEjb;
import com.soa.ejb.remotes.MyEjbRemote;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;

@RestController
public class MyController {

    private static final String JNDI_NAME = "ejb:/worker-ejb-1.0-SNAPSHOT/MyEjb!com.soa.ejb.remotes.MyEjbRemote";

    @GetMapping("/hello")
    public String hello() {
        try {
            Context context = new InitialContext();
            MyEjbRemote myEjb = (MyEjbRemote) context.lookup(JNDI_NAME);
            return myEjb.sayHello("World");
        } catch (NamingException e) {
            throw new RuntimeException("JNDI lookup failed", e);
        }
    }
}