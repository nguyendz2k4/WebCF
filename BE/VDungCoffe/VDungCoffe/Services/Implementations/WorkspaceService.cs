using VDungCoffe.Common.Exceptions;
using VDungCoffe.DTO.Admin.Workspace;
using VDungCoffe.Services.Interfaces;

namespace VDungCoffe.Services.Implementations;

public class WorkspaceService : IWorkspaceService
{
    // Retained only for compatibility with existing registrations; no unrestricted database reads.
    public Task<AdminWorkspaceResponse> GetWorkspaceSnapshotAsync() =>
        throw new WorkspaceRetiredException();

    private sealed class WorkspaceRetiredException : AppException
    {
        public WorkspaceRetiredException() : base("API snapshot đã ngừng hỗ trợ. Sử dụng API admin riêng có phân quyền và phân trang.", 410) { }
    }
}
