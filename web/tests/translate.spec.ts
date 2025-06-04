// import { test, expect } from '@playwright/test';
// import { TranslateService } from "../src/app/@core/translate/translate.service";
// import { TranslatePipe } from "../src/app/@core/translate/translate.pipe";

// test("測試翻譯服務",  async () => {
//     let service = await TranslateService;
//     let pipe: TranslatePipe;

//     beforeEach(() => {
//         TestBed.configureTestingModule({ providers: [TranslateService] });
//         service = TestBed.inject(TranslateService);
//         pipe = new TranslatePipe(service);
//     });

//     it("測試服務", () => {
//         // 設定目前語言為英文
//         service.language.set("en");
//         expect(service.instant("test")).toBe("My Test");
//         expect(service.instant("test1", "John")).toBe("Test1, John");
//         expect(service.instant("test2", ["A", "B"])).toBe("Test2, A and B");

//         // 設定目前語言為中文
//         service.language.set("zh");
//         expect(service.instant("test")).toBe("我的測試");
//         expect(service.instant("test1", "楊")).toBe("測試一，楊");
//         expect(service.instant("test2", ["國王", "皇后"])).toBe("測試二，國王和皇后");

//         // 測試找不到翻譯的情況
//         expect(service.instant("test3")).toBe("test3");
//     });

//     it("測試管道", () => {
//         expect(pipe.transform("test")).toBe("我的測試");
//         expect(pipe.transform("test1", "楊")).toBe("測試一，楊");
//         expect(pipe.transform("test2", ["國王", "皇后"])).toBe("測試二，國王和皇后");
//     });
// });
