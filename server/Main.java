import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;
import java.io.IOException;

public class Main {
    public static void main(String[] args) throws IOException {
        // Resolve data directory relative to where the jar/class is run from
        String dataDir = args.length > 0 ? args[0] : "../data";

        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

        server.createContext("/api/videos",     new JsonFileHandler(dataDir + "/videos.json"));
        server.createContext("/api/newspapers",  new JsonFileHandler(dataDir + "/newspapers.json"));
        server.createContext("/api/books",       new JsonFileHandler(dataDir + "/books.json"));
        server.createContext("/api/events",      new JsonFileHandler(dataDir + "/events.json"));
        server.createContext("/api/educational", new JsonFileHandler(dataDir + "/educational.json"));

        server.setExecutor(null); // default executor
        server.start();
        System.out.println("eLibAP server running at http://localhost:8080");
        System.out.println("Data directory: " + dataDir);
    }
}
