import { ReactNode } from "react";
import { Box, createStyles, Divider, ScrollArea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Header from "./header";
import Sidebar from "./sidebar";
import { colorModeValue } from "../utils/theme-utils";
import CourseSubmissionCommentsSection from "./course-submission-comments-section";

type Props = {
  children: ReactNode;
};

const useStyles = createStyles((theme) => ({
  layout: {
    display: "flex",
    height: "100vh",
  },
  sidebar: {
    flex: "0 0 auto",
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    flex: "1 1 auto",
  },
  contentContainer: {
    display: "flex",
    flex: "1 1 auto",
    backgroundColor: colorModeValue(theme.colorScheme, {
      lightModeValue: theme.colors.gray[0],
      darkModeValue: theme.colors.dark[8],
    }),
    overflow: "hidden",
  },
  scrollArea: {
    flex: "1 1 auto",
  },
  commentsSection: {
    flex: "0 0 auto",
  },
}));

function AppLayout({ children }: Props) {
  const [isSidebarExpanded, { toggle }] = useDisclosure(true);
  const { classes } = useStyles();

  return (
    <div className={classes.layout}>
      {/* Sidebar */}
      <Sidebar
        className={classes.sidebar}
        isSidebarExpanded={isSidebarExpanded}
      />

      <Divider orientation="vertical" />

      {/* Main page */}
      <div className={classes.mainContainer}>
        {/* Header */}
        <Header
          isSiderbarExpanded={isSidebarExpanded}
          onSidebarToggle={toggle}
        />

        <Divider />

        {/* Main content */}
        <div className={classes.contentContainer}>
          <ScrollArea className={classes.scrollArea} offsetScrollbars>
            <Box<"main"> component="main" pt="md" pb="xl" px="xl">
              {children}
            </Box>
          </ScrollArea>

          <CourseSubmissionCommentsSection
            className={classes.commentsSection}
          />
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
