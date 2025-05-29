import React from "react";
import { Flex, Avatar, Typography } from "antd";
import type { IUser } from "../../../interfaces";

type Props = {
    user?: IUser;
};

export const UserInfoSummary: React.FC<Props> = ({ user }) => {
    // build initials fallback if no avatar URL is available
    const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();

    return (
        <Flex align="center" gap={32}>
            <Avatar
                size={96}
                // If you later add an avatar URL field to IUser, swap in user.avatarUrl here.
                // Otherwise we show initials
                style={{ backgroundColor: "#87d068" }}
            >
                {initials || "#"}
            </Avatar>
            <Flex vertical>
                <Typography.Text type="secondary">
                    #{user?.id}
                </Typography.Text>
                <Typography.Title level={3} style={{ margin: 0 }}>
                    {user?.fullName}
                </Typography.Title>
            </Flex>
        </Flex>
    );
};
