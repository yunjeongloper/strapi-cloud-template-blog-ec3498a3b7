"use strict";

/**
 * storage controller
 */

// @ts-ignore
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::storage.storage", ({ strapi }) => ({
  async find(ctx) {
    var enhancedResults;

    // 쿼리 파라미터 유효성 검사
    await this.validateQuery(ctx);

    // 쿼리 파라미터 정리 및 안전화
    const sanitizedQueryParams = await this.sanitizeQuery(ctx);

    // 저장소 데이터 조회
    const { results, pagination } = await strapi
      .service("api::storage.storage")
      .find(sanitizedQueryParams);

    try {
      // 최신 Movement 데이터를 각 저장소에 추가
      enhancedResults = await Promise.all(
        results.map(async (storage) => {
          const latestMovement = await strapi
            .service("api::movement.movement")
            .find({
              filters: {
                to_storages: {
                  id: storage.id, // 해당 저장소가 이동 후 저장소에 포함된 경우
                },
              },
              sort: { createdAt: "desc" }, // 최신 데이터 기준 정렬
              pagination: { limit: 1 }, // 최신 데이터 하나만 가져오기
              populate: {
                spirits: true, // Movement와 연결된 spirits 관계 포함
              },
            });

          return {
            ...storage,
            latestMovement: latestMovement.results[0] || null, // Movement 데이터 추가 또는 null
          };
        })
      );
    } catch (err) {
      console.error("Error fetching articles:", err);
    }

    // 데이터 출력 안전화
    const sanitizedResults = await this.sanitizeOutput(enhancedResults, ctx);

    return this.transformResponse(sanitizedResults, { pagination });
  },
  async findOne(ctx) {
    // 쿼리 파라미터 유효성 검사
    await this.validateQuery(ctx);

    // 쿼리 파라미터 정리 및 안전화
    const sanitizedQueryParams = await this.sanitizeQuery(ctx);

    // 요청 경로의 ID 추출
    const { id } = ctx.params;

    // 특정 저장소 데이터 조회
    const storage = await strapi
      .service("api::storage.storage")
      .findOne(id, sanitizedQueryParams);

    if (!storage) {
      return ctx.notFound("Storage not found");
    }

    // 최신 Movement 데이터 조회
    const latestMovement = await strapi.service("api::movement.movement").find({
      filters: {
        to_storages: {
          id: storage.id, // 해당 저장소가 이동 후 저장소에 포함된 경우
        },
      },
      sort: { updatedAt: "desc" }, // 최신 데이터 기준 정렬
      pagination: { limit: 1 }, // 최신 데이터 하나만 가져오기
      populate: {
        spirits: true, // Movement와 연결된 spirits 관계 포함
        to_storages: true, // Movement와 연결된 to_storages 관계 포함
        from_storages: true, // Movement와 연결된 to_storages 관계 포함
      },
    });

    // 최신 Movement 데이터를 저장소 데이터에 추가
    const enhancedStorage = {
      ...storage,
      latestMovement: latestMovement.results[0] || null, // Movement 데이터 추가 또는 null
    };

    // 데이터 출력 안전화
    const sanitizedResult = await this.sanitizeOutput(enhancedStorage, ctx);

    // 응답 반환
    return this.transformResponse(sanitizedResult);
  },
}));
