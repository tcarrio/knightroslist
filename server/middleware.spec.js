var MOCK_UNIVERSITY_DATA = {};

const { verifyAuthor } = require("./middleware");
const MockUniversity = require("./models/university");

jest.mock("./models/university", () => ({
  addById: (id, value) => (MOCK_UNIVERSITY_DATA[id] = value),
  findById: (id) => MOCK_UNIVERSITY_DATA[id],
  clear: () =>
    Object.keys(MOCK_UNIVERSITY_DATA).forEach(
      (key) => delete MOCK_UNIVERSITY_DATA[key],
    ),
}));

class TestMongoModel {
  constructor(value) {
    this.value = value;
  }

  equals(value) {
    return this.value === value;
  }
}

describe("Middleware", () => {
  // //Verifies the university author
  // module.exports.verifyAuthor = async (req, res, next) => {
  //     const id = req.params.id;
  //     const university = await University.findById(id);
  //     if (!university.author.equals(req.user._id)) {
  //         req.flash('error', 'Access Denied!');
  //         return res.redirect(`/universities/${id}`);
  //     }
  //     next();
  // }

  describe("verifyAuthor", () => {
    it("should deny access when the university author is not the current user", async () => {
      // scaffold the test case scenario
      const universityId = "0";
      const university = {
        author: new TestMongoModel("1"),
      };
      MockUniversity.addById(universityId, university);

      const currentUserId = "2";

      const mockFlash = jest.fn();
      const mockRedirect = jest.fn();

      const mockRequest = {
        params: {
          id: universityId,
        },
        user: { _id: currentUserId },
        flash: mockFlash,
      };
      const mockResponse = { redirect: mockRedirect };

      const mockNext = jest.fn();

      // call the middleware
      await verifyAuthor(mockRequest, mockResponse, mockNext);

      // assert the functions are called as expected
      expect(mockRequest.flash).toHaveBeenCalledWith("error", "Access Denied!");
      expect(mockResponse.redirect).toHaveBeenCalledWith("/universities/0");
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should allow access when the university author is the current user", async () => {
      // scaffold the test case scenario
      const universityId = "0";
      const university = {
        author: new TestMongoModel("2"),
      };
      MockUniversity.addById(universityId, university);

      const currentUserId = "2";

      const mockFlash = jest.fn();
      const mockRedirect = jest.fn();

      const mockRequest = {
        params: {
          id: universityId,
        },
        user: { _id: currentUserId },
        flash: mockFlash,
      };
      const mockResponse = { redirect: mockRedirect };

      const mockNext = jest.fn();

      // call the middleware
      await verifyAuthor(mockRequest, mockResponse, mockNext);

      // assert the functions are called as expected
      expect(mockRequest.flash).not.toHaveBeenCalled();
      expect(mockResponse.redirect).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
