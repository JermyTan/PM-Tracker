import {
  Avatar,
  Checkbox,
  Group,
  TransferList,
  TransferListData,
  TransferListItemComponent,
  TransferListItemComponentProps,
  Text,
  TransferListItem,
} from "@mantine/core";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { capitalize } from "lodash";
import pluralize from "pluralize";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { USER, NAME, EMAIL } from "../constants";
import { useAppSelector } from "../redux/hooks";
import { useGetCourseMembershipsQuery } from "../redux/services/members-api";
import { CourseMemberData, Role } from "../types/courses";
import { UserData } from "../types/users";
import { sort } from "../utils/transform-utils";
import PlaceholderWrapper from "./placeholder-wrapper";

type Props = {
  groupUserData?: UserData[];
  courseId?: number;
};

const convertMemberDataToTransferListData = (
  courseMemberData: CourseMemberData,
) => {
  const roleString = capitalize(pluralize(courseMemberData.role.toLowerCase()));

  return {
    value: `${courseMemberData.id}`,
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

function GroupEditMembersMenu({ groupUserData, courseId }: Props) {
  const { data: allCourseMembers, isLoading } = useGetCourseMembershipsQuery(
    courseId ?? skipToken,
  );

  const [data, setData] = useState<TransferListData>([[], []]);

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

  return (
    <PlaceholderWrapper
      isLoading={isLoading}
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
    </PlaceholderWrapper>
  );
}

export default GroupEditMembersMenu;
