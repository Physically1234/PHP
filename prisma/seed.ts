import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const main = async () => {
    await prisma.comments.deleteMany();
    await prisma.posts.deleteMany();
    await prisma.pcp.deleteMany();

    for (let i = 0; i < 10; i++) {  
        await prisma.pcp.create({
            data: {
                email: faker.internet.email(),
                password: faker.lorem.words(),
                name: faker.internet.userName(),
                contact_number: faker.random.numeric(),
                bio: faker.lorem.sentence(),
                address: faker.lorem.sentence(),
                posts: {
                    create: [
                        {
                            content: faker.lorem.paragraphs(),
                            title: faker.lorem.words(10),
                            created_at: faker.random.numeric()

                        },
                        {
                            content: faker.lorem.paragraphs(),
                            title: faker.lorem.words(10),
                            created_at: faker.random.numeric()
                        }
                    ]
                }
            }
        })
    }
}

const user = await prisma.pcp.findMany();
const post = await prisma.posts.findFirst();

await Promise.all(
    user.map(async (user) => {
        await prisma.comments.createMany({
            data: [
                {
                    comments: faker.lorem.sentence(),
                    postsId: post?.id!,
                    pcpId: user?.id!,
                },
                {
                    comments: faker.lorem.sentence(),
                    postsId: post?.id!,
                    pcpId: user?.id!,
                },
            ],
        });
    })
);

main()
    .then(() => console.log("Data seeded successfully 😎🚀"))
    .catch((e) => console.log(e))
    .finally(async () => await prisma.$disconnect());