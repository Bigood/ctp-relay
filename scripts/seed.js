import { db } from 'api/src/lib/db'

export default async () => {
  try {
    //
    // Manually seed via `yarn rw prisma db seed`
    // Seeds automatically with `yarn rw prisma migrate dev` and `yarn rw prisma migrate reset`
    //
    // Update "const data = []" to match your data model and seeding needs
    //
    const instances = [
      // To try this example data with the UserExample model in schema.prisma,
      // uncomment the lines below and run 'yarn rw prisma migrate dev'
      
      { 
        host: "mac-a.cartotalents.com",
        token: "5ccebdfd7e0057678f1db2c7653dc7c8",
        secret: "38967ecdc18b5dbf268de562866988c30290d097e0ecfd4d0f72655cc00d8f96",
        version: "0.0.1",
      },
      {
        host: "mac-b.cartotalents.com",
        token: "4039bc0c9f7844efa452f510c7739755",
        secret: "a4707df1b275c270cf4a68af530d0debf5e5da03846b6f5e2468a74a59130f5b",
        version: "0.0.1",
      },
    ]
    console.log(
      "\nUsing the default './scripts/seed.{js,ts}' template\nEdit the file to add seed data\n"
    )
    await db.instance.createMany({ data: instances })

  } catch (error) {
    console.warn('Please define your seed data.')
    console.error(error)
  }
}
