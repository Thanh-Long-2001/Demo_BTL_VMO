import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { Role } from "../enums/role.enum";
import { Observable } from "rxjs"

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    // Hàm canActivate trả về true / false cho biết yêu cầu có được thực hiện hay không
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if(requiredRoles) {
            return true;
        }
        
        const { user } = context.switchToHttp().getRequest();
        return requiredRoles.some((role) => {user.role?.include(role)});
    }
}

