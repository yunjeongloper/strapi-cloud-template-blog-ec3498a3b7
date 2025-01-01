"use strict";

/**
 * filtration controller
 */

// @ts-ignore
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::filtration.filtration",
  ({ strapi }) => ({
    async findOne(ctx) {
      // for list
      // await this.validateQuery(ctx);

      const { id } = ctx.params; // URL의 ID 가져오기
      const { query } = ctx; // 쿼리 파라미터 가져오기

      // fot list
      // const sanitizedQueryParams = await this.sanitizeQuery(ctx);

      const data = await strapi
        .service("api::filtration.filtration")
        .findOne(id, {
          ...query,
          populate: {
            spirits: true, // 첫 번째 관계 데이터
            movement: {
              // 두 번째 관계 데이터
              populate: "to_storages", // 중첩 관계 데이터
            },
          },
        });

      // 데이터가 없는 경우 404 반환
      if (!data) {
        return ctx.notFound("The requested resource does not exist");
      }

      // 응답 변환 및 반환
      return this.transformResponse(data);
    },
  })
);
