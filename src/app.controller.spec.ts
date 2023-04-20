import { AppController } from "./app.controller";
import { AppService } from "./app.service";

describe("AppController", () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(() => {
    appService = new AppService();
    appController = new AppController(appService);
  });

  describe("getHealth", () => {
    it("should return Operational", async () => {
      const result = { status: "Operational" };

      jest
        .spyOn(appService, "getHealth")
        .mockImplementation(async () => result);

      expect(await appController.getHealth()).toEqual(result);
    });
  });
});
