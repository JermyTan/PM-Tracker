import { useFieldArray } from "react-hook-form";
import { Button } from "@mantine/core";
import { DragDropContext, Draggable, DropResult } from "react-beautiful-dnd";
import { HiPlus } from "react-icons/hi";
import { FORM_FIELD_DATA } from "../constants";
import { StrictModeDroppable } from "./strict-mode-droppable";
import { DEFAULT_FORM_FIELD, FormField } from "../types/templates";
import FormFieldBuilder from "./form-field-builder";

type Props = {
  name: string;
};

function FormFieldBuilderSection({ name }: Props) {
  const { fields, append, remove, move } = useFieldArray<{
    [name: string]: FormField[];
  }>({
    name,
  });
  const canDeleteFields = fields.length >= 2;

  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) {
      return;
    }

    const { index: destinationIndex } = destination;
    const { index: sourceIndex } = source;

    if (destinationIndex === sourceIndex) {
      return;
    }

    move(sourceIndex, destinationIndex);
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <StrictModeDroppable droppableId={FORM_FIELD_DATA}>
          {({ innerRef, droppableProps, placeholder }) => (
            <div ref={innerRef} {...droppableProps}>
              {fields.map(({ id }, index) => (
                <Draggable key={id} index={index} draggableId={id}>
                  {({ innerRef, draggableProps, dragHandleProps }) => (
                    <div ref={innerRef} {...draggableProps}>
                      <FormFieldBuilder
                        index={index}
                        onDeleteField={
                          canDeleteFields ? () => remove(index) : undefined
                        }
                        dragHandleProps={dragHandleProps}
                        sectionName={FORM_FIELD_DATA}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </DragDropContext>

      <Button
        color="teal"
        variant="subtle"
        onClick={() => append(DEFAULT_FORM_FIELD)}
      >
        <HiPlus size={20} />
      </Button>
    </>
  );
}

export default FormFieldBuilderSection;
