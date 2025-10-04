import { useNavigate, useParams, useLocation } from "react-router-dom";

export function withRouter(Component) {
    function ComponentWithRouterProp(props) {
        let navigate = useNavigate();
        let params = useParams();
        let location = useLocation();
        return (
            <Component
                {...props}
                navigate={navigate}
                params={params}
                location={location}
            />
        );
    }

    return ComponentWithRouterProp;
}
