export class Client {
  readonly id: string;
  name: string;
  email: string | null;
  phone: string | null;
  isActive: boolean;
  readonly createdAt: Date;
  updatedAt: Date;
  canceledAt: Date | null;

  private constructor(props: Client) {
    Object.assign(this, props);
  }
}