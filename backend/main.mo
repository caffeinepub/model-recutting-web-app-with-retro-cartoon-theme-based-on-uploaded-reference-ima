import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profiles
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Recut project state
  var nextProjectId = 0;

  type RecutsSettings = {
    cutPlaneAngle : Float;
    cutPlaneOffset : Float;
    showReferenceModel : Bool;
    showSectionHelper : Bool;
  };

  type Project = {
    id : Nat;
    owner : Principal;
    name : Text;
    description : Text;
    recutsSettings : RecutsSettings;
  };

  let projects = Map.empty<Nat, Project>();

  public shared ({ caller }) func createRecutsProject(name : Text, description : Text, recutsSettings : RecutsSettings) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create projects");
    };

    let projectId = nextProjectId;
    nextProjectId += 1;

    let project : Project = {
      id = projectId;
      owner = caller;
      name;
      description;
      recutsSettings;
    };

    projects.add(projectId, project);
    projectId;
  };

  public query ({ caller }) func getRecutsProjectsByCaller() : async [Project] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view projects");
    };
    projects.values().filter(
      func(p) { p.owner == caller }
    ).toArray();
  };

  public query ({ caller }) func getRecutsProjectById(projectId : Nat) : async Project {
    switch (projects.get(projectId)) {
      case (?project) {
        if (project.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Not project owner");
        };
        project;
      };
      case (null) { Runtime.trap("Project not found") };
    };
  };

  public shared ({ caller }) func updateRecutsProject(productId : Nat, name : Text, description : Text, recutsSettings : RecutsSettings) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update projects");
    };

    switch (projects.get(productId)) {
      case (?project) {
        if (project.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Not project owner");
        };
        let updatedProject : Project = {
          project with
          name;
          description;
          recutsSettings;
        };
        projects.add(productId, updatedProject);
      };
      case (null) { Runtime.trap("Project not found") };
    };
  };

  public shared ({ caller }) func deleteRecutsProject(productID : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete projects");
    };

    switch (projects.get(productID)) {
      case (?project) {
        if (project.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Not project owner");
        };
      };
      case (null) { Runtime.trap("Project not found") };
    };

    projects.remove(productID);
  };
};
