async function testBackend() {
  try {
    const res = await fetch('http://localhost:3000/admin/dashboard');
    const data = await res.json();
    console.log("DASHBOARD STATS RESPONSE:");
    console.log(JSON.stringify(data, null, 2));
    
    const resTransports = await fetch('http://localhost:3000/transports');
    const transports = await resTransports.json();
    console.log("\nTRANSPORTS RESPONSE:");
    console.log(JSON.stringify(transports, null, 2));
  } catch (error) {
    console.error("Test blocked by:", error);
  }
}
testBackend();
