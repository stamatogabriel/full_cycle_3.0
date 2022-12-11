import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { CategoryRepositoryContract } from '@fc/micro-videos/category/domain';
import { CATEGORY_PROVIDERS } from '../../src/categories/category.providers';

describe('CategoriesController (e2e)', () => {
  let app: INestApplication;
  let categoryRepo: CategoryRepositoryContract.Repository;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    categoryRepo = moduleFixture.get<CategoryRepositoryContract.Repository>(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/categories (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/categories')
      .send({ name: 'Movie' })
      .expect(201);

    expect(Object.keys(response.body)).toStrictEqual([
      'id',
      'name',
      'description',
      'is_active',
      'created_at',
    ]);

    const category = await categoryRepo.findById(response.body.id);
    expect(response.body.id).toBe(category.id);
    expect(response.body.created_at).toBe(category.created_at.toISOString());
    expect(response.body).toMatchObject({
      name: 'Movie',
      description: null,
      is_active: true,
    });
  });
});
