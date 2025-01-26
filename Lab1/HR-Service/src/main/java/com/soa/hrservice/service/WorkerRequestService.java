package com.soa.hrservice.service;

import jakarta.ejb.Singleton;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManager;
import org.apache.hc.client5.http.socket.ConnectionSocketFactory;
import org.apache.hc.client5.http.socket.PlainConnectionSocketFactory;
import org.apache.hc.client5.http.ssl.SSLConnectionSocketFactory;
import org.apache.hc.core5.http.ClassicHttpRequest;
import org.apache.hc.core5.http.ContentType;
import org.apache.hc.core5.http.HttpEntity;
import org.apache.hc.core5.http.config.RegistryBuilder;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.apache.hc.core5.http.io.entity.StringEntity;
import org.apache.hc.core5.http.io.support.ClassicRequestBuilder;
import org.apache.hc.core5.ssl.SSLContextBuilder;
import org.apache.hc.core5.ssl.SSLContexts;
import org.apache.hc.core5.util.TimeValue;
import org.apache.hc.core5.util.Timeout;

import javax.net.ssl.SSLContext;
import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.security.KeyStore;
import java.util.UUID;

@Singleton
public class WorkerRequestService {
    public final String SSL_PORT = "22001";
    public final String HTTP_PORT = "8080";
    public final String DELETE_URL = "https://localhost:"+SSL_PORT+"/api/worker/delete/";
    public final String HIRE_URL = "https://localhost:"+SSL_PORT+"/api/worker/create";

    private CloseableHttpClient createSecureHttpClient() {
        try {
            KeyStore trustStore = KeyStore.getInstance(KeyStore.getDefaultType());
            try (FileInputStream trustStoreStream = new FileInputStream("jaxrs.truststore")) {
                trustStore.load(trustStoreStream, "truststore_password".toCharArray());
            }

            SSLContext sslContext = SSLContextBuilder.create()
                    .loadTrustMaterial(trustStore, null)
                    .build();

            SSLConnectionSocketFactory sslSocketFactory = new SSLConnectionSocketFactory(sslContext);

            PoolingHttpClientConnectionManager connectionManager = new PoolingHttpClientConnectionManager(
                    RegistryBuilder.<ConnectionSocketFactory>create()
                            .register("https", sslSocketFactory)
                            .register("http", PlainConnectionSocketFactory.getSocketFactory())
                            .build()
            );

            return HttpClients.custom()
                    .setConnectionManager(connectionManager)
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Ошибка создания HTTPS клиента", e);
        }
    }


    public String fireWorker(UUID uuid) {
        try (CloseableHttpClient httpclient = createSecureHttpClient()) {
            ClassicHttpRequest httpGet = ClassicRequestBuilder
                    .delete( DELETE_URL + uuid.toString())
                    .build();
            return getMessageFromResponse(httpclient, httpGet);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public String hirePerson(String personId, String position, String startDate) {
        StringEntity requestEntity = new StringEntity(
          "{ " +
                  " \"startDate\": \"" + startDate + "\"," +
                  "\"position\": \"" + position + "\"," +
                  "\"personId\": \"" + personId + "\"" +
                  "}",
                ContentType.APPLICATION_JSON);
        try (final CloseableHttpClient httpClient = createSecureHttpClient()) {
            ClassicHttpRequest httpPost = new HttpPost(HIRE_URL);
            httpPost.setEntity(requestEntity);
            return getMessageFromResponse(httpClient, httpPost);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private String getMessageFromResponse(CloseableHttpClient httpClient, ClassicHttpRequest httpRequest) throws IOException {
        return httpClient.execute(httpRequest, response -> {
            final HttpEntity entity = response.getEntity();
            BufferedReader br = new BufferedReader(
                    new InputStreamReader((response.getEntity().getContent())));
            String output;
            while ((output = br.readLine()) != null) {
                System.out.println(output);
            }
            EntityUtils.consume(entity);
            return output;
        });
    }

}
