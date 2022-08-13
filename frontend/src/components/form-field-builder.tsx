import {
  Box,
  createStyles,
  Divider,
  Group,
  Paper,
  Tooltip,
  Text,
  ActionIcon,
  SelectItem,
} from "@mantine/core";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";
import { useWatch } from "react-hook-form";
import { FaTrashAlt } from "react-icons/fa";
import { MdDragIndicator } from "react-icons/md";
import { TYPE } from "../constants";
import { FormFieldType } from "../types/templates";
import FlexSpacer from "./flex-spacer";
import FormFieldBuilderRenderer from "./form-field-builder-renderer";
import SelectField from "./select-field";

const useStyles = createStyles({
  topSection: {
    height: "48px",
  },
  fieldNumberContainer: {
    minWidth: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  typeSelector: {
    height: "48px",
    paddingLeft: "12px",
    paddingRight: "30px",
  },
  deleteIconContainer: {
    height: "100%",
    width: "48px",
  },
  dragContainer: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

const FORM_FIELD_TYPE_OPTIONS: SelectItem[] = [
  {
    value: FormFieldType.Text,
    label: "Single line",
    group: "Free response",
  },
  {
    value: FormFieldType.TextArea,
    label: "Paragraph",
    group: "Free response",
  },
  {
    value: FormFieldType.Numeric,
    label: "Numeric",
    group: "Free response",
  },
  {
    value: FormFieldType.Mcq,
    label: "Multiple choice",
    group: "Selectable response",
  },
  {
    value: FormFieldType.Mrq,
    label: "Multiple response",
    group: "Selectable response",
  },
  {
    value: FormFieldType.TextDisplay,
    label: "Text display",
    group: "Other",
  },
];

type Props = {
  index: number;
  onDeleteField?: () => void;
  dragHandleProps?: DraggableProvidedDragHandleProps;
  sectionName: string;
};

function FormFieldBuilder({
  index,
  onDeleteField,
  dragHandleProps,
  sectionName,
}: Props) {
  const { classes } = useStyles();
  const canDeleteField = onDeleteField !== undefined;
  const builderName = `${sectionName}.${index}`;
  const typeFieldName = `${builderName}.${TYPE}`;

  const formFieldType = useWatch<{ [name: string]: FormFieldType }>({
    name: typeFieldName,
  });

  return (
    <Box py="xs">
      <Paper withBorder shadow="sm">
        <Group noWrap spacing={0} className={classes.topSection}>
          <Box px="sm" className={classes.fieldNumberContainer}>
            {index + 1}
          </Box>

          <Divider orientation="vertical" />

          <SelectField
            name={typeFieldName}
            data={FORM_FIELD_TYPE_OPTIONS}
            variant="unstyled"
            classNames={{ input: classes.typeSelector }}
          />

          <Divider orientation="vertical" />

          <FlexSpacer />

          <Divider orientation="vertical" />

          <Tooltip
            label={<Text size="xs">Delete field.</Text>}
            withArrow
            transitionDuration={300}
            disabled={!canDeleteField}
          >
            <ActionIcon
              className={classes.deleteIconContainer}
              color="red"
              variant="transparent"
              onClick={onDeleteField}
              disabled={!canDeleteField}
            >
              <FaTrashAlt />
            </ActionIcon>
          </Tooltip>
          <Divider orientation="vertical" />
          <Tooltip
            label={
              <Text size="xs">
                Drag and move up/down to rearrange the fields.
              </Text>
            }
            withArrow
            position="top-end"
            transition="pop-bottom-right"
            transitionDuration={300}
            multiline
            width={180}
          >
            <Box {...dragHandleProps} px="sm" className={classes.dragContainer}>
              <MdDragIndicator size={24} />
            </Box>
          </Tooltip>
        </Group>

        <Divider />

        <Box p="md">
          <FormFieldBuilderRenderer
            formFieldType={formFieldType}
            builderName={builderName}
          />
        </Box>
      </Paper>
    </Box>
  );
}

export default FormFieldBuilder;
