import { createSelector } from "@reduxjs/toolkit";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useMemo } from "react";
import { useGetCourseId } from "../custom-hooks/use-get-course-id";
import { useGetTemplateId } from "../custom-hooks/use-get-template-id";
import { useGetTemplatesQueryState } from "../redux/services/templates-api";
import { TemplateData } from "../types/templates";

function MilestoneTemplateDisplay() {
  const courseId = useGetCourseId();
  const templateId = useGetTemplateId();

  const selectTemplate = useMemo(
    () =>
      createSelector(
        (data?: TemplateData[]) => data,
        (_: unknown, id?: number | string) => id,
        (data, id) => {
          // TODO: is there a better way to match the string to the number
          const template = data?.find((template) => `${template.id}` === id);
          return {
            template,
          };
        },
      ),
    [],
  );

  const { template } = useGetTemplatesQueryState(courseId ?? skipToken, {
    selectFromResult: ({ data: templates }) =>
      selectTemplate(templates, templateId),
  });

  console.log("template", template);

  return (
    <>
      <div></div>
    </>
  );
}

export default MilestoneTemplateDisplay;
