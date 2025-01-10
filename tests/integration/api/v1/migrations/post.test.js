describe("POST /api/v1/migrations", () => {
    const fetchMigrations = async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations", {
        method: "POST",
      });
      const body = await response.json();
      return { status: response.status, body };
    };
  
    describe("Anonymous user", () => {
      describe("Running pending migrations", () => {
        test("For the first time", async () => {
          const { status, body } = await fetchMigrations();
          
          expect(status).toBe(201);
          expect(Array.isArray(body)).toBe(true);
          expect(body.length).toBeGreaterThan(0);
        });
  
        test("For the second time", async () => {
          const { status, body } = await fetchMigrations();
          
          expect(status).toBe(200);
          expect(Array.isArray(body)).toBe(true);
          expect(body.length).toBe(0);
        });
      });
    });
  });
  