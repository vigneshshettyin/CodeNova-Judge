import app from "./app";
import { config } from "./config/env";
import { startWorker } from "./worker/worker";

const PORT = config.PORT || 6789;

app.listen(PORT, () => {
  console.log(`Code Judge API running on port ${PORT}`);
});

startWorker();
