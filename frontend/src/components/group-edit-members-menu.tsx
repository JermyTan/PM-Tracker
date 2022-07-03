import {
  Avatar,
  Checkbox,
  Group,
  TransferList,
  TransferListData,
  TransferListItemComponent,
  TransferListItemComponentProps,
  Text,
  Button,
  Space,
} from "@mantine/core";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { capitalize } from "lodash";
import pluralize from "pluralize";
import { useEffect, useState } from "react";
import { USER, NAME, EMAIL } from "../constants";
import { useAppSelector } from "../redux/hooks";
import { usePatchCourseGroupMutation } from "../redux/services/groups-api";
import { useGetCourseMembershipsQuery } from "../redux/services/members-api";
import { CourseMemberData } from "../types/courses";
import { GroupPatchAction, GroupPatchData } from "../types/groups";
import { UserData } from "../types/users";
import { useResolveError } from "../utils/error-utils";
import toastUtils from "../utils/toast-utils";
import { sort } from "../utils/transform-utils";
import PlaceholderWrapper from "./placeholder-wrapper";

type Props = {
  groupUserData?: UserData[];
  courseId?: number;
  groupId?: number;
};

const convertMemberDataToTransferListData = (
  courseMemberData: CourseMemberData,
) => {
  const roleString = capitalize(pluralize(courseMemberData.role.toLowerCase()));

  return {
    value: `${courseMemberData.user.id}`,
    image: courseMemberData.user.profileImage,
    label: courseMemberData.user.name,
    description: courseMemberData.user.email,
    group: roleString,
  };
};

const sortAndConvertMemberDataToListFormat = (members?: CourseMemberData[]) =>
  sort(members ?? [], {
    props: [`${USER}.${NAME}`, `${USER}.${EMAIL}`],
  }).map((member) => convertMemberDataToTransferListData(member));

const ItemComponent: TransferListItemComponent = ({
  data,
  selected,
}: TransferListItemComponentProps) => (
  // TODO: Disable adding/removing self?

  <Group noWrap>
    <Avatar src={data.image} radius="xl" size="sm" />
    <div style={{ flex: 1 }}>
      <Text size="sm" weight={500}>
        {data.label}
      </Text>
      <Text size="xs" color="dimmed" weight={400}>
        {data.description}
      </Text>
    </div>
    <Checkbox
      checked={selected}
      onChange={() => {}}
      tabIndex={-1}
      sx={{ pointerEvents: "none" }}
    />
  </Group>
);

function GroupEditMembersMenu({ groupUserData, courseId, groupId }: Props) {
  const { data: allCourseMembers, isLoading: isLoadingCourseMemberships } =
    useGetCourseMembershipsQuery(courseId ?? skipToken);

  const [data, setData] = useState<TransferListData>([[], []]);

  const [batchUpdateGroupMembers, { isLoading: isUpdatingGroupMembers }] =
    usePatchCourseGroupMutation();

  useEffect(() => {
    const currentGroupMembersSet = new Set();

    const filteredGroupMembers: CourseMemberData[] = [];
    const availableMembers: CourseMemberData[] = [];

    groupUserData?.forEach((member) => {
      currentGroupMembersSet.add(member.id);
    });

    allCourseMembers?.forEach((member) => {
      if (currentGroupMembersSet.has(member.user.id)) {
        filteredGroupMembers.push(member);
        return;
      }

      availableMembers.push(member);
    });

    const transferListValues: TransferListData = [
      sortAndConvertMemberDataToListFormat(filteredGroupMembers),
      sortAndConvertMemberDataToListFormat(availableMembers),
    ];

    setData(transferListValues);
  }, [allCourseMembers, groupUserData]);

  const userId = useAppSelector(({ currentUser }) => currentUser?.user?.id);

  const resolveError = useResolveError();

  const onUpdateGroupMembers = async () => {
    if (
      isUpdatingGroupMembers ||
      courseId === undefined ||
      groupId === undefined
    ) {
      return;
    }

    const groupPatchData: GroupPatchData = {
      action: GroupPatchAction.UpdateMembers,
      payload: {
        userIds: data[0].map((item) => item.value),
      },
    };

    try {
      await batchUpdateGroupMembers({
        ...groupPatchData,
        courseId,
        groupId,
      }).unwrap();

      toastUtils.success({
        message: `You have successfully updated the members of the group.`,
      });
    } catch (error) {
      resolveError(error);
    }
  };

  return (
    <PlaceholderWrapper
      isLoading={isLoadingCourseMemberships}
      loadingMessage="Loading members..."
      defaultMessage="No members found."
      showDefaultMessage={!allCourseMembers || allCourseMembers?.length === 0}
    >
      <TransferList
        itemComponent={ItemComponent}
        value={data}
        onChange={setData}
        // filter={(query, item) =>
        //   item.label.toLowerCase().includes(query.toLowerCase().trim()) ||
        //   item.description.toLowerCase().includes(query.toLowerCase().trim())
        // }
      />
      <Space h="md" />
      <Group position="center">
        <Button
          onClick={onUpdateGroupMembers}
          disabled={isUpdatingGroupMembers}
          loading={isUpdatingGroupMembers}
        >
          Save changes
        </Button>
        <Button color="gray">Cancel</Button>
      </Group>
    </PlaceholderWrapper>
  );
}

export default GroupEditMembersMenu;
