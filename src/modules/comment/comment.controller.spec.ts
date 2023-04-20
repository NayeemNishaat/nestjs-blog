import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";
import { getModelToken } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";
import { Comment, CommentDocument } from "../../models/comment.entity";
import { Article } from "../../models/article.entity";
import { Model } from "mongoose";
import { CreateCommentDto } from "./dto/comment.dto";
import { getComment } from "./stub/comment.stub";

describe("CommentController", () => {
  let commentController: CommentController;
  let commentService: CommentService;
  let mockCommentModel: Model<CommentDocument>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        CommentService,
        {
          provide: getModelToken(Comment.name),
          useValue: {
            create: jest.fn().mockResolvedValue(getComment())
          }
        },
        {
          provide: getModelToken(Article.name),
          useValue: Article
        }
      ]
    }).compile();

    commentService = moduleRef.get<CommentService>(CommentService);
    commentController = moduleRef.get<CommentController>(CommentController);
    mockCommentModel = moduleRef.get<Model<CommentDocument>>(
      getModelToken(Comment.name)
    );
  });

  describe("createComment", () => {
    it("should create a new comment", async () => {
      let createCommentDto: CreateCommentDto;

      const spy = jest
        .spyOn(commentService, "createComment")
        .mockImplementation(async () => {
          return mockCommentModel.create(createCommentDto);
        });

      const result = await commentController.createComment(createCommentDto);

      expect(spy).toBeCalledWith(createCommentDto);
      expect(result).toEqual(getComment());
    });
  });
});
