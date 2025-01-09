"use strict";

/**
 * spirit controller
 */

// @ts-ignore
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::spirit.spirit", ({ strapi }) => ({
  async findOne(ctx) {
    // 쿼리 파라미터 유효성 검사
    await this.validateQuery(ctx);

    // 쿼리 파라미터 정리 및 안전화
    const sanitizedQueryParams = await this.sanitizeQuery(ctx);

    // 요청 경로의 ID 추출
    const { id } = ctx.params;

    const spirit = await strapi
      .service("api::spirit.spirit")
      .findOne(id, sanitizedQueryParams);

    if (!spirit) {
      return ctx.notFound("Spirit not found");
    }

    // 원액과 연관된 제성 데이터 조회
    const proofings = await strapi.service("api::proofing.proofing").find({
      filters: {
        spirits: {
          id: spirit.id,
        },
      },
      populate: {
        movement: true,
      },
      sort: { updatedAt: "desc" },
    });

    // 원액과 연관된 여과 데이터 조회
    const filtrations = await strapi
      .service("api::filtration.filtration")
      .find({
        filters: {
          spirits: {
            id: spirit.id,
          },
        },
        populate: {
          movement: true,
        },
        sort: { updatedAt: "desc" },
      });

    // 데이터를 저장소 데이터에 추가
    const enhancedSpirit = {
      ...spirit,
      proofings,
      filtrations,
    };

    // 데이터 출력 안전화
    const sanitizedResult = await this.sanitizeOutput(enhancedSpirit, ctx);

    // 응답 반환
    return this.transformResponse(sanitizedResult);
  },
  async findReadyToBottling(ctx) {
    // 쿼리 파라미터 유효성 검사
    await this.validateQuery(ctx);

    // 쿼리 파라미터 정리 및 안전화
    const sanitizedQueryParams = await this.sanitizeQuery(ctx);

    // 원액 데이터 조회
    // 1. 여과 공정 정보가 있는데
    // 2. 여과 공정 타입이 'Final'인 경우
    const results = await strapi.service("api::spirit.spirit").find({
      ...sanitizedQueryParams,
      filters: {
        filtrations: {
          filtrationType: "Final", // 해당 저장소가 이동 후 저장소에 포함된 경우
        },
      },
      populate: {
        filtrations: true,
      },
    });

    // 데이터 출력 안전화
    const sanitizedResult = await this.sanitizeOutput(results, ctx);

    // 응답 반환
    return this.transformResponse(sanitizedResult);
  },
}));
