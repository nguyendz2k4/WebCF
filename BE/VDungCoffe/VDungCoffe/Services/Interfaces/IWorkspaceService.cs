using VDungCoffe.DTO.Admin.Workspace;

namespace VDungCoffe.Services.Interfaces;

public interface IWorkspaceService
{
    Task<AdminWorkspaceResponse> GetWorkspaceSnapshotAsync();
}
