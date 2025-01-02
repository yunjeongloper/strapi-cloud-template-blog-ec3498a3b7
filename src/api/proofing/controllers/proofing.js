"use strict";

/**
 * proofing controller
 */

// @ts-ignore
const { createCoreController } = require("@strapi/strapi").factories;

// module.exports = createCoreController('api::proofing.proofing');

module.exports = createCoreController(
  "api::proofing.proofing",
  ({ strapi }) => ({
    async find(ctx) {
      // 쿼리 파라미터 유효성 검사
      await this.validateQuery(ctx);

      // 쿼리 파라미터 정리 및 안전화
      const sanitizedQueryParams = await this.sanitizeQuery(ctx);

      // 제성 데이터 조회
      const { results, pagination } = await strapi
        .service("api::proofing.proofing")
        .find({ ...sanitizedQueryParams, populate: { spirits: true } });

      // 데이터 출력 안전화
      const sanitizedResults = await this.sanitizeOutput(results, ctx);

      return this.transformResponse(sanitizedResults, { pagination });
    },
    async findOne(ctx) {
      // 쿼리 파라미터 유효성 검사
      await this.validateQuery(ctx);

      // 쿼리 파라미터 정리 및 안전화
      const sanitizedQueryParams = await this.sanitizeQuery(ctx);

      // 요청 경로의 ID 추출
      const { id } = ctx.params;

      // 특정  데이터 조회
      const proofing = await strapi
        .service("api::proofing.proofing")
        .findOne(id, {
          ...sanitizedQueryParams,
          populate: {
            spirits: true,
            movement: { populate: { to_storages: true, from_storages: true } },
          },
        });

      if (!proofing) {
        return ctx.notFound("Proofing not found");
      }

      const sanitizedResult = await this.sanitizeOutput(proofing, ctx);

      // 응답 반환
      return this.transformResponse(sanitizedResult);
    },
  })
);
