import {
  TemplateData,
  TemplatePostData,
  TemplatePutData,
} from "../../types/templates";
import { cacher } from "./api-cache-utils";
import baseApi from "./base-api";

const templatesApi = baseApi
  .enhanceEndpoints({ addTagTypes: ["Template"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getTemplates: build.query<TemplateData[], string | number>({
        query: (courseId) => ({
          url: `/courses/${courseId}/templates/`,
          method: "GET",
        }),
        providesTags: (result, _, courseId) =>
          cacher.providesList(result, "Template", [`${courseId}`]),
      }),

      createTemplate: build.mutation<
        TemplateData,
        TemplatePostData & {
          courseId: string | number;
        }
      >({
        query: ({ courseId, ...templatePostData }) => ({
          url: `/courses/${courseId}/templates/`,
          method: "POST",
          body: templatePostData,
        }),
        invalidatesTags: (_, error, { courseId }) =>
          error ? [] : cacher.invalidatesList("Template", [`${courseId}`]),
      }),

      getSingleTemplate: build.query<
        TemplateData,
        { courseId: string | number; templateId: string | number }
      >({
        query: ({ courseId, templateId }) => ({
          url: `/courses/${courseId}/templates/${templateId}/`,
          method: "GET",
        }),
        providesTags: (_, __, { templateId: id, courseId }) => [
          cacher.getIdTag(id, "Template", [`${courseId}`]),
        ],
      }),

      updateTemplate: build.mutation<
        TemplateData,
        TemplatePutData & {
          courseId: string | number;
          templateId: string | number;
        }
      >({
        query: ({ courseId, templateId, ...templatePutData }) => ({
          url: `/courses/${courseId}/templates/${templateId}/`,
          method: "PUT",
          body: templatePutData,
        }),
        invalidatesTags: (_, error, { templateId: id, courseId }) =>
          error ? [] : [cacher.getIdTag(id, "Template", [`${courseId}`])],
      }),

      deleteTemplate: build.mutation<
        TemplateData,
        {
          courseId: string | number;
          templateId: string | number;
        }
      >({
        query: ({ courseId, templateId }) => ({
          url: `/courses/${courseId}/templates/${templateId}/`,
          method: "DELETE",
        }),
        invalidatesTags: (_, error, { templateId: id, courseId }) =>
          error ? [] : [cacher.getIdTag(id, "Template", [`${courseId}`])],
      }),
    }),
  });

export const useGetTemplatesQueryState =
  templatesApi.endpoints.getTemplates.useQueryState;

export const {
  useGetTemplatesQuery,
  useCreateTemplateMutation,
  useGetSingleTemplateQuery,
  useUpdateTemplateMutation,
  useDeleteTemplateMutation,
} = templatesApi;
