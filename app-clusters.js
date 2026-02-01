const cluster = require("cluster");
const os = require("os");
const express = require("express");

const port = 3000;
const limit = 5000000000;
const totalCPUs = os.cpus().length;

if (cluster.isMaster) {
  console.log("Number of CPUs is " + totalCPUs);
  console.log("Master " + process.pid + " is running");

  // Crear workers
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  // Si un worker muere, crear otro
  cluster.on("exit", (worker, code, signal) => {
    console.log("Worker " + worker.process.pid + " died");
    console.log("Forking a new worker...");
    cluster.fork();
  });

} else {
  const app = express();

  console.log("Worker " + process.pid + " started");

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.get("/api/:n", function (req, res) {
    let n = parseInt(req.params.n);
    let count = 0;

    if (n > limit) n = limit;

    for (let i = 0; i <= n; i++) {
      count += i;
    }

    res.send("Final count is " + count);
  });

  app.listen(port, () => {
    console.log("App listening on port " + port);
  });
}
