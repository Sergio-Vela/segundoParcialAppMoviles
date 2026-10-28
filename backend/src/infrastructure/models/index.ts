import { User } from "./userModel"
import { UserProfile } from "./userProfileModel";
import { Censo } from "./censoModel";
import { Location } from "./locationModel";

export const registerModels = () => {

    User.hasOne(UserProfile, { foreignKey: 'userId', as: 'profile' });
    UserProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' })
    User.hasMany(Censo, { foreignKey: "creadoPor", as: "censos" });
    Censo.belongsTo(User, { foreignKey: "creadoPor", as: "creador" });
    User.hasMany(Location, { foreignKey: "userId", as: "locations" });
    Location.belongsTo(User, { foreignKey: "userId", as: "user" });

    return { User, UserProfile, Censo, Location };
}