import { Post } from "../../models/posting";
import { SchoolType } from "../../models/school";
import { User } from "../../models/user";

export async function GetUserPostings() {
    var post1: Post = {
        Id: '1234',
        PosterId: '16352',
        SchoolId: '123',
        SchoolName: "Thom Collegiate",
        SchoolType: SchoolType.Secondary,
        PostDescription: "Science 10, Chemistry 20/20"
    };

    var post2: Post = {
        Id: '1234',
        PosterId: '16352',
        SchoolId: '123',
        SchoolName: "Thom Collegiate",
        SchoolType: SchoolType.Secondary,
        PostDescription: "Science 10, Chemistry 20/20"
    };

    var post3: Post = {
        Id: '1234',
        PosterId: '16352',
        SchoolId: '123',
        SchoolName: "Thom Collegiate",
        SchoolType: SchoolType.Secondary,
        PostDescription: "Science 10, Chemistry 20/20"
    };
    var post4: Post = {
        Id: '1234',
        PosterId: '16352',
        SchoolId: '123',
        SchoolName: "Thom Collegiate",
        SchoolType: SchoolType.Secondary,
        PostDescription: "Science 10, Chemistry 20/20"
    };

    return [post1, post2, post3, post4];
}